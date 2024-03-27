const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const passport = require('passport');

const Product = require('./Routes/Product');
const ProductCategory = require('./Routes/CategoryProducts');
const BlogCategory = require('./Routes/BlogCategory');
const Blog = require('./Routes/Blogs');
const User = require('./Routes/User');
const Brand = require('./Routes/Brand');
const Coupon = require('./Routes/Coupon');
const Bill = require('./Routes/Bill');
const Comments = require('./Routes/Comments');
const passportRouter = require('./Routes/Passport');
const scheduleDailyDiscountTask = require('./Schedule/DiscountTime');

env.config();

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@storecos.tdvrzb9.mongodb.net/CuaHangThucPhamChucNang`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        );
        console.log('Mongodb Connected');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
connectDB();
scheduleDailyDiscountTask();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: process.env.URL_CLIENT,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }),
);
app.use(session({ secret: '12axcvbRupee', resave: true, saveUninitialized: true }));
app.use(passport.session());
app.use(passport.initialize());
app.use('/api/auth', passportRouter);

app.use(cookieParser());
app.use('/api/users', User);
app.use('/api/products', Product);
app.use('/api/comments', Comments);
app.use('/api/productcategory', ProductCategory);
app.use('/api/blogcategory', BlogCategory);
app.use('/api/blog', Blog);
app.use('/api/brand', Brand);
app.use('/api/coupon', Coupon);
app.use('/api/bill', Bill);

const PORT = 5000;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
