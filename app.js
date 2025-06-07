const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const { db, verifyUser, createLog } = require('./db');
const moment = require('moment-timezone');

const app = express();
const port = process.env.PORT || 3000;
const ADMIN_SECRET = 'myadmin123'; // In production, use environment variable

// Set moment locale to Thai
moment.locale('th');

// Function to generate random history
const getRandomHistory = () => {
  const values = ['P', 'B', 'T'];
  return Array.from({ length: 12 }, () => values[Math.floor(Math.random() * values.length)]);
};

// Initialize session history
const initSessionHistory = (req) => {
  if (!req.session.history) {
    req.session.history = {};
  }
};

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout');

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check if user is authenticated and not expired
const checkLoginAndNotExpired = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    db.get(
        'SELECT expired_at FROM users WHERE id = ? AND username = ?',
        [req.session.user.id, req.session.user.username],
        (err, user) => {
            if (err) {
                console.error('Database error:', err);
                req.session.destroy(() => {
                    return res.redirect('/login');
                });
            }

            if (!user) {
                req.session.destroy(() => {
                    return res.redirect('/login');
                });
            }

            // Check if user is expired
            if (user.expired_at && new Date(user.expired_at) < new Date()) {
                req.session.destroy(() => {
                    return res.redirect('/login?error=expired');
                });
            } else {
                next();
            }
        }
    );
};

// Admin middleware
const isAdmin = (req, res, next) => {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Login routes
app.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    const error = req.query.error === 'expired' ? 'บัญชีของคุณหมดอายุแล้ว' : null;
    res.render('login', { error, username: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        db.get(
            'SELECT * FROM users WHERE username = ?',
            [username],
            async (err, user) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.render('login', { 
                        error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 
                        username: null 
                    });
                }

                if (!user) {
                    return res.render('login', { 
                        error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 
                        username: null 
                    });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    // Check expiration before allowing login
                    if (user.expired_at && new Date(user.expired_at) < new Date()) {
                        return res.render('login', {
                            error: 'บัญชีของคุณหมดอายุแล้ว',
                            username: null
                        });
                    }

                    req.session.user = {
                        id: user.id,
                        username: user.username,
                        isAdmin: user.is_admin
                    };
                    res.redirect('/');
                } else {
                    res.render('login', { 
                        error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 
                        username: null 
                    });
                }
            }
        );
    } catch (error) {
        console.error('Login error:', error);
        res.render('login', { 
            error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 
            username: null 
        });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Admin routes
app.get('/admin/login', (req, res) => {
    if (req.session.isAdmin) {
        return res.redirect('/admin');
    }
    res.render('admin-login', { error: null });
});

app.post('/admin/login', (req, res) => {
    const { secretKey } = req.body;
    if (secretKey === ADMIN_SECRET) {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('admin-login', { error: 'รหัสผ่านไม่ถูกต้อง' });
    }
});

app.get('/admin', isAdmin, (req, res, next) => {
    res.locals.layout = 'admin/layout';
    next();
}, (req, res) => {
    res.redirect('/admin/users');
});

app.get('/admin/users', isAdmin, (req, res, next) => {
    res.locals.layout = 'admin/layout';
    next();
}, (req, res) => {
    db.all('SELECT * FROM users WHERE username != "admin"', [], (err, users) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.render('admin/users', { 
            title: 'จัดการผู้ใช้',
            users,
            success: req.query.success,
            error: req.query.error,
            moment: moment // Add moment to template
        });
    });
});

app.get('/admin/logs', isAdmin, (req, res, next) => {
    res.locals.layout = 'admin/layout';
    next();
}, (req, res) => {
    db.all('SELECT * FROM logs ORDER BY created_at DESC LIMIT 100', [], (err, logs) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Database error');
        }
        res.render('admin/logs', { 
            title: 'บันทึกการใช้งาน',
            logs
        });
    });
});

app.post('/admin/add', isAdmin, async (req, res) => {
    const { username, password, expired_at } = req.body;
    try {
        // Check if username already exists
        db.get('SELECT id FROM users WHERE username = ?', [username], async (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return res.redirect('/admin/users?error=Database error occurred');
            }
            if (row) {
                return res.redirect('/admin/users?error=Username already exists');
            }

            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                
                // Convert Buddhist Era to Christian Era by subtracting 543 years
                const thaiDate = moment.tz(expired_at, 'Asia/Bangkok');
                const christianDate = thaiDate.clone().subtract(543, 'years');
                const expiredAt = christianDate.format('YYYY-MM-DD HH:mm:ss');
                
                await db.run(
                    'INSERT INTO users (username, password, expired_at, is_admin) VALUES (?, ?, datetime(?), 0)',
                    [username, hashedPassword, expiredAt]
                );
                res.redirect('/admin/users?success=User added successfully');
            } catch (error) {
                console.error('Error:', error);
                res.redirect('/admin/users?error=Failed to add user');
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/admin/users?error=Failed to add user');
    }
});

app.post('/admin/edit/:id', isAdmin, async (req, res) => {
    const { expired_at } = req.body;
    try {
        // Convert Buddhist Era to Christian Era by subtracting 543 years
        const thaiDate = moment.tz(expired_at, 'Asia/Bangkok');
        const christianDate = thaiDate.clone().subtract(543, 'years');
        const expiredAt = christianDate.format('YYYY-MM-DD HH:mm:ss');

        await db.run(
            'UPDATE users SET expired_at = datetime(?, "localtime") WHERE id = ? AND username != "admin"',
            [expiredAt, req.params.id]
        );
        res.redirect('/admin/users?success=User updated successfully');
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/admin/users?error=Failed to update user');
    }
});

app.post('/admin/delete/:id', isAdmin, async (req, res) => {
    try {
        await db.run(
            'DELETE FROM users WHERE id = ? AND username != "admin"',
            [req.params.id]
        );
        res.redirect('/admin/users?success=User deleted successfully');
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/admin/users?error=Failed to delete user');
    }
});

// Admin API routes
app.post('/admin/users', isAdmin, async (req, res) => {
    const { username, password, expired_at } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run(
            'INSERT INTO users (username, password, expired_at, is_admin) VALUES (?, ?, ?, 0)',
            [username, hashedPassword, expired_at],
            (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                }
                res.redirect('/admin');
            }
        );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/admin/users/:id', isAdmin, (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ? AND is_admin = 0', [id], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ success: true });
    });
});

// Protected routes
app.get('/', checkLoginAndNotExpired, (req, res) => {
    res.render('index', { 
        username: req.session.user.username,
        title: 'บาคาร่าออนไลน์'
    });
});

// Formula routes
app.get('/formula/:provider', checkLoginAndNotExpired, (req, res) => {
    const provider = req.params.provider;
    const exit = req.query.exit === '1';
    
    const casinoNames = {
        'sa-gaming': 'SA GAMING',
        'allbet': 'ALLBET',
        'wm-casino': 'WM CASINO',
        'sexy-baccarat': 'SEXY BACCARAT'
    };

    if (!casinoNames[provider]) {
        return res.redirect('/');
    }

    // Reset history for this provider if exit=1
    if (exit && req.session.history) {
        Object.keys(req.session.history).forEach(key => {
            if (key.startsWith(provider)) {
                delete req.session.history[key];
            }
        });
    }

    const rooms = [1, 2, 3, 4, 5].map(n => ({
        id: n,
        name: provider === 'sexy-baccarat' ? `SEXY ห้อง ${n}` : `${casinoNames[provider]} ห้อง ${n}`,
        winrate: Math.max(51, Math.floor(Math.random() * 50) + 51),
        userCount: Math.floor(Math.random() * 400) + 600 // Generates a number between 600-999
    }));

    res.render('formulas', {
        provider: provider,
        casinoName: casinoNames[provider],
        rooms,
        username: req.session.user.username,
        title: `สูตรบาคาร่า ${casinoNames[provider]}`
    });
});

app.get('/formula/:provider/table:tableId', checkLoginAndNotExpired, (req, res) => {
    const { provider, tableId } = req.params;
    const casinoNames = {
        'sa-gaming': 'SA GAMING',
        'allbet': 'ALLBET',
        'wm-casino': 'WM CASINO',
        'sexy-baccarat': 'SEXY BACCARAT'
    };

    if (!casinoNames[provider]) {
        return res.redirect('/');
    }

    // Initialize session history if needed
    if (!req.session.history) {
        req.session.history = {};
    }

    const historyKey = `${provider}_table${tableId}`;
    
    // Only reset history if it doesn't exist for this table
    if (!req.session.history[historyKey]) {
        req.session.history[historyKey] = [];
    }

    // Initialize investment history if it doesn't exist
    if (!req.session.investmentHistory) {
        req.session.investmentHistory = [];
    }

    // Initialize play history if it doesn't exist
    if (!req.session.playHistory) {
        req.session.playHistory = [];
    }

    // Generate new formula
    const formula = Math.random() > 0.5 ? 'P' : 'B';
    const currentSuggestion = formula;
    
    // Ensure winrate is between 40% and 100%
    const winrate = Math.max(40, Math.floor(Math.random() * 61) + 40);

    res.render('table', {
        provider,
        casinoName: casinoNames[provider],
        tableId,
        formula,
        history: req.session.history[historyKey],
        winrate,
        username: req.session.user.username,
        title: `${casinoNames[provider]} ห้อง ${tableId}`,
        currentSuggestion,
        investmentHistory: req.session.investmentHistory || [],
        playHistory: req.session.playHistory || [] // Add playHistory to template data
    });
});

// New POST route for table actions
app.post('/formula/:provider/table:tableId/action', checkLoginAndNotExpired, async (req, res) => {
    const { provider, tableId } = req.params;
    const { action } = req.body;
    
    if (!action) {
        return res.status(400).send('Action is required');
    }

    // Initialize session history if needed
    if (!req.session.history) {
        req.session.history = {};
    }

    const historyKey = `${provider}_table${tableId}`;
    if (!req.session.history[historyKey]) {
        req.session.history[historyKey] = [];
    }

    // Add result to history based on action
    switch (action) {
        case 'WIN':
            // Get the formula that was recommended
            const suggested = req.body.formula; // 'P' or 'B'
            
            // Add the last formula result (P/B) and track the recommendation
            const lastFormula = suggested;
            req.session.history[historyKey].unshift(lastFormula);
            
            // Update investment history
            if (!req.session.investmentHistory) {
                req.session.investmentHistory = [];
            }
            req.session.investmentHistory.unshift({
                round: req.session.investmentHistory.length + 1,
                result: 'WIN',
                suggested: suggested,
                timestamp: new Date()
            });

            // Update play history
            if (!req.session.playHistory) {
                req.session.playHistory = [];
            }
            req.session.playHistory.unshift({
                round: req.session.playHistory.length + 1,
                result: 'WIN',
                suggested: suggested,
                timestamp: new Date()
            });
            
            // Limit histories to last 20 entries
            if (req.session.investmentHistory.length > 20) {
                req.session.investmentHistory = req.session.investmentHistory.slice(0, 20);
            }
            if (req.session.playHistory.length > 20) {
                req.session.playHistory = req.session.playHistory.slice(0, 20);
            }
            break;
        case 'DRAW':
            // Add tie to regular history
            req.session.history[historyKey].unshift('T');
            
            // Update investment history with tie suggestion
            if (!req.session.investmentHistory) {
                req.session.investmentHistory = [];
            }
            req.session.investmentHistory.unshift({
                round: req.session.investmentHistory.length + 1,
                result: 'DRAW',
                suggested: 'T',
                timestamp: new Date()
            });

            // Update play history
            if (!req.session.playHistory) {
                req.session.playHistory = [];
            }
            req.session.playHistory.unshift({
                round: req.session.playHistory.length + 1,
                result: 'DRAW',
                suggested: 'T',
                timestamp: new Date()
            });
            
            // Limit histories to last 20 entries
            if (req.session.investmentHistory.length > 20) {
                req.session.investmentHistory = req.session.investmentHistory.slice(0, 20);
            }
            if (req.session.playHistory.length > 20) {
                req.session.playHistory = req.session.playHistory.slice(0, 20);
            }
            break;
        case 'NEXT':
            // Get the formula that was recommended and switch it to opposite side
            const suggestedNext = req.body.formula === 'P' ? 'B' : 'P';
            
            // Add dash to regular history
            req.session.history[historyKey].unshift('-');
            
            // Update investment history with opposite suggestion
            if (!req.session.investmentHistory) {
                req.session.investmentHistory = [];
            }
            req.session.investmentHistory.unshift({
                round: req.session.investmentHistory.length + 1,
                result: 'NEXT',
                suggested: suggestedNext,
                timestamp: new Date()
            });

            // Update play history
            if (!req.session.playHistory) {
                req.session.playHistory = [];
            }
            req.session.playHistory.unshift({
                round: req.session.playHistory.length + 1,
                result: 'NEXT',
                suggested: suggestedNext,
                timestamp: new Date()
            });
            
            // Limit histories to last 20 entries
            if (req.session.investmentHistory.length > 20) {
                req.session.investmentHistory = req.session.investmentHistory.slice(0, 20);
            }
            if (req.session.playHistory.length > 20) {
                req.session.playHistory = req.session.playHistory.slice(0, 20);
            }
            break;
        default:
            return res.status(400).send('Invalid action');
    }

    // Create log entry
    try {
        await createLog(req.session.user.username, action, provider, tableId);
    } catch (error) {
        console.error('Error creating log:', error);
    }

    // Limit history to last 20 results
    if (req.session.history[historyKey].length > 20) {
        req.session.history[historyKey] = req.session.history[historyKey].slice(0, 20);
    }

    // Redirect back to table page
    res.redirect(`/formula/${provider}/table${tableId}`);
});

// New route for handling room exit
app.get('/formula/:provider/table:tableId/exit', checkLoginAndNotExpired, (req, res) => {
    const { provider, tableId } = req.params;
    
    // Clear investment history
    req.session.investmentHistory = [];
    
    // Clear play history if exists
    if (req.session.playHistory) {
        req.session.playHistory = [];
    }
    
    // Clear specific table history
    if (req.session.history) {
        const historyKey = `${provider}_table${tableId}`;
        if (req.session.history[historyKey]) {
            req.session.history[historyKey] = [];
        }
    }
    
    // Redirect back to formula provider page
    res.redirect(`/formula/${provider}`);
});

// API Routes
app.get('/api/winrate/:provider', (req, res) => {
    const winrates = [1, 2, 3, 4, 5].map(tableId => ({
        table: tableId,
        winrate: Math.max(51, Math.floor(Math.random() * 50) + 51)
    }));
    res.json(winrates);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 