import { pool } from "../db.js";

export const createProductController = async (req, res) => {
    const { name, description, price } = req.body;
    let img = req.body.img;

    try {
        if(img === '' || img === undefined || img === null) img = 'https://media.istockphoto.com/id/1987775073/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BA%D0%BE%D1%80%D0%B7%D0%B8%D0%BD%D0%B0-%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BE%D0%BA-%D1%87%D0%B5%D1%80%D0%BD%D0%B0%D1%8F-%D0%BB%D0%B8%D0%BD%D0%B8%D1%8F-%D1%80%D0%B8%D1%81%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B7%D0%BD%D0%B0%D1%87%D0%BE%D0%BA.jpg?s=612x612&w=0&k=20&c=BB4Dg9-4VX9Kh74b9YwKN140mhFad2Rs_BOcjvqxslw='
        await pool.query(
            'INSERT INTO products (name, description, price, img) VALUES ($1, $2, $3, $4)', [name, description, price, img]
        );
        return res.json({ succes: true });
    } catch (error) {
        return res.status(500).json({ succes: false });
    }
}