const express = require("express");
const app = express();
const mysql = require("mysql2/promise");
const cors =  require("cors");
const port = process.env.PORT || 3306;

const rootPath = __dirname;

app.use(express.json());
app.use(cors());
async function connectToDB() {
	return await mysql.createConnection({
		host: "localhost:3306",
		user: "invexpay_exchanger",
		password: "K7^1ze53a",
		database: "invexpay_bestexchang",
	});
	// return await mysql.createConnection({
	// 	host: "localhost",
	// 	user: "root",
	// 	password: "root",
	// 	database: "backend",
	// });
}

async function getAllPercentValues() {
	try {
		const connection = await connectToDB();
		const [companyPercentValues] = await connection.execute('SELECT * FROM company_percent_values');
		const [paylamaPercentValues] = await connection.execute('SELECT * FROM paylama_percent_values');
		const [otcPercentValues] = await connection.execute('SELECT * FROM otc_percent_values');
		await connection.end();

		return {
			companyPercentValues,
			paylamaPercentValues,
			otcPercentValues,
		};
	} catch (error) {
		console.error('Error fetching percent values:', error);
		throw error;
	}
}
async function getNews() {
	try {
		const pool = await mysql.createPool({
			// host: "localhost",
			// user: "root",
			// password: "root",
			// database: "backend",
			host: "localhost:3306",
			user: "invexpay_exchanger",
			password: "K7^1ze53a",
			database: "invexpay_bestexchang",
		});

		return await pool.query('SELECT * FROM Posts ORDER BY timestamp DESC;');
	} catch (error) {
		console.error('Error fetching news:', error);
		throw error;
	}
}

async function getReviews() {
	try {
		const connection = await connectToDB();
		const [rows] = await connection.execute('SELECT * FROM reviews');
		await connection.end();

		return rows;
	} catch (error) {
		console.error('Error fetching reviews:', error);
		throw error;
	}
}


app.get('/', async (req, res) => {
	try {
		const percentValues = await getAllPercentValues();
		res.json(percentValues);
	} catch (error) {
		console.error('Error fetching percent values:', error);
		res.status(500).send('Internal Server Error');
	}
});


app.get('/news', async (req, res) => {
	try {
		const news = await getNews();
		res.json(news)
	} catch (error) {
		console.error('Error fetching news:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.post('/addReview', async (req, res) => {
	const { name, text, time } = req.body;
	try {
		const connection = await connectToDB();
		await connection.execute('INSERT INTO reviews (user_name, user_text, review_date) VALUES (?, ?, ?)', [name, text, time]);
		await connection.end();

		res.status(200).send('Review added successfully');
	} catch (error) {
		console.error('Error adding review:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/reserve', async (req, res) => {
	try {
		const connection = await connectToDB();
		const [rows] = await connection.execute('SELECT * FROM max_reserve_data');
		await connection.end();

		res.json(rows);
	} catch (error) {
		console.error('Ошибка выполнения SQL-запроса:', error);
		res.status(500).json({ error: 'Ошибка при получении данных из базы данных' });
	}
});

app.get('/reviews', async (req, res) => {
	try {
		const reviews = await getReviews();
		res.json(reviews);
	} catch (error) {
		console.error('Error fetching reviews:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.get('/rules', (req, res) => {
	const selectedLanguage = req.query.lang;

	let pdfFilePath;
	if (selectedLanguage === 'ru') {
		pdfFilePath = './assets/pdf/rulesRu.pdf';
	} else {
		pdfFilePath = "./assets/pdf/rulesEn.pdf";
	}

	res.sendFile(pdfFilePath, {root: rootPath});
});

app.get('/cookie', (req, res) => {
	const selectedLanguage = req.query.lang;

	let pdfFilePath;
	if (selectedLanguage === 'ru') {
		pdfFilePath = './assets/pdf/cookieRu.pdf';
	} else {
		pdfFilePath = "./assets/pdf/cookieEn.pdf";
	}

	res.sendFile(pdfFilePath, {root: rootPath});
});

app.get('/privacy', (req, res) => {
	const selectedLanguage = req.query.lang;

	let pdfFilePath;
	if (selectedLanguage === 'ru') {
		pdfFilePath = './assets/pdf/privacyRu.pdf';
	} else {
		pdfFilePath = "./assets/pdf/privacyEn.pdf";
	}

	res.sendFile(pdfFilePath, {root: rootPath});
});


app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});