const express = require('express');
const cors = require('cors');
const models = require('./models')
const app = express();
const port = 8080;

const multer = require('multer')
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})

app.use(express.json())
app.use(cors());
app.use('/uploads', express.static('uploads'))

app.get('/banners', (req, res) => {
    models.Banner.findAll({
        limit: 2
    }).then((result) => {
        res.send({
            banners: result,
        })
    }).catch((err) => {
        console.log(err);
        res.status(500).send("에러가 발생했습니다.")
    })
})

app.get("/products", (req, res) => {
    models.Product.findAll({
        order: [['updatedAt', 'DESC']],
        attributes: ['id', 'name', 'price', 'createdAt', 'seller', 'imageUrl', 'soldout'],
    })
        .then((result) => {
            res.send({
                products: result,
            })
        }).catch((err) => {
            console.log(err);
            res.status(400).send("에러 발생")
        })
});
app.post("/products", (req, res) => {
    const body = req.body;
    const { name, description, price, seller, imageUrl, soldout } = body;
    if (!name || !description || !price || !seller || !imageUrl) {
        res.status(400).send("모든 필드를 입력해주세요");
    }
    models.Product.create({
        name,
        price,
        description,
        seller,
        imageUrl,
        soldout
    }).then((result) => {
        console.log("상품 생성 결과 : ", result);
        res.send({
            result,
        });
    }).catch((error) => {
        console.error(error);
        res.send("상품 업로드에 문제가 발생했습니다");
    });
});
app.post('/purchase/:id', (req, res) => {
    const { id } = req.params
    models.Product.update({
        soldout: 1
    }, {
        where: {
            id
        }
    }).then( (result) =>{
        res.send({
            resulte: true
        })
    }).catch( (err) => {
        console.log(err);
        res.send("에러가 발생했습니다.");
    })
})


app.get("/products/:id", (req, res) => {
    const { id } = req.params
    models.Product.findOne({
        where: {
            id: id
        },
        attributes: ['id', 'name', 'price', 'createdAt', 'seller', 'imageUrl', 'description', 'soldout'],
    }).then((result) => {
        console.log(result);
        res.send({
            product: result
        })
    }).catch((err) => {
        console.log(err);
        res.status(400).send("상품 조회에 에러가 발생했습니다.")
    })
})

app.post('/image', upload.single('image'), (req, res) => {
    const file = req.file
    console.log(file);
    res.send({
        imageUrl: file.path
    })
})

app.listen(port, () => {
    console.log("쇼핑몰 서버가 돌아가고 있습니다.");
    models.sequelize
        .sync()
        .then(() => {
            console.log("DB 연결 성공");
        }).catch((err) => {
            console.log(err);
            console.log("DB 연결 실패");
            process.exit()
        })
})
