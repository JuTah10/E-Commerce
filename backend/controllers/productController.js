import { db } from "../config/db.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await db`
            SELECT * FROM product
        `;

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log("Error in getAllProducts ", error);
        res.status(500).json({ success: false, message: error.message });
    }

}

export const getDisplayedProduct = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const PAGE_LIMIT = 6;
    const offset = (page - 1) * PAGE_LIMIT;
    const sort = req.query.sort;
    let orderBy = "";

    const [{ count }] = await db`
        SELECT COUNT(*) AS count FROM product WHERE displayed_product = TRUE
    `
    if (sort === "price_asc") {
        orderBy = "price ASC";
    } else if (sort === "price_desc") {
        orderBy = "price DESC";
    }

    try {
        let query = `
            SELECT id, name, price, image, stock_quantity, categories
            FROM product
            WHERE displayed_product = True
        `;
        if (orderBy) {
            query += ` ORDER BY ${orderBy}`;
        }
        query += ` 
                OFFSET ${offset}
                LIMIT ${PAGE_LIMIT}`

        const displayedProducts = await db(query);
        if (displayedProducts.length === 0) {
            return res.status(404).json({ success: false, message: "Current no items is being sold! Come back later!" });
        }

        res.status(200).json({ success: true, data: displayedProducts, totalPages: Math.ceil(count / PAGE_LIMIT) });


    } catch (error) {
        console.log("Error in getDisplayedProduct ", error);
        res.status(500).json({ message: "Server error", message: error.message });
    }
}

export const toggleDisplayedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const findProduct = await db`
            SELECT * FROM product WHERE id=${id};
        `;
        if (findProduct.length === 0) {
            return res.status(404).json({ message: "No product found" });
        }
        const updatedProduct = await db`
            UPDATE product SET displayed_product = NOT displayed_product WHERE id = ${id} RETURNING *
        `;

        res.status(200).json({ success: true, data: updatedProduct[0] });
    } catch (error) {
        console.log("Error inside toggleDisplayedProduct ", error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export const getFeaturedProduct = async (req, res) => {
    try {
        let featuredProduct = await redis.get("featured_product");

        //if exists in redis
        if (featuredProduct) {
            return res.status(200).json({ success: true, data: JSON.parse(featuredProduct) });
        }

        //not exists in redis
        featuredProduct = await db`
        SELECT id, name, price, image, stock_quantity, categories FROM product WHERE slide_display = True;
        `;

        if (featuredProduct.length === 0) {
            return res.status(404).json({ success: false, message: "No Featured Product" });
        }

        await redis.set(`featured_product`, JSON.stringify(featuredProduct))
        res.status(201).json({ success: true, data: featuredProduct });

    } catch (error) {
        console.log("Error in getFeaturedProduct", error);
        res.status(500).json({ message: "Server error", message: error.message });
    }
}
export const toggleFeaturedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const findProduct = await db`
            SELECT * FROM product WHERE id=${id};
        `;
        if (findProduct.length === 0) {
            return res.status(404).json({ message: "No product found" });
        }
        const updatedProduct = await db`
            UPDATE product SET slide_display = NOT slide_display WHERE id = ${id} RETURNING *
        `;

        const findFeatureProduct = await db`
            SELECT id, name, price, image, stock_quantity, categories FROM product WHERE slide_display = TRUE;
        `;

        await redis.set("featured_product", JSON.stringify(findFeatureProduct));


        res.status(200).json({ success: true, data: updatedProduct[0] });
    } catch (error) {
        console.log("Error inside toggleFeaturedProduct ", error);
        res.status(500).json({ success: false, error: error.message });
    }

}

export const createNewProduct = async (req, res) => {
    console.log(req.body)
    try {
        const { name, price, image, stock_quantity, categories } = req.body;
        if (!name || !price || !image || !stock_quantity || !categories) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        //check if user request product already existed or not
        try {
            const searchForProduct = await db`
            SELECT * FROM product WHERE name = ${name};
            `;

            if (searchForProduct.length > 0) {
                console.log("Product already existed")
                return res.status(409).json({ success: false, message: "Product with that name already existed!", existedProduct: searchForProduct[0] });
            }
        } catch (error) {
            console.log("Error inside createNewProduct - searchForProduct");
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }


        //upload to cloudinary
        let uploadResult;
        try {
            uploadResult = await cloudinary.uploader.upload(image, { folder: "productsImage" });
        } catch (error) {
            console.log("Error uploading image to Cloudinary ", error);
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }


        const newProduct = await db`
           INSERT INTO product (name, price, image, stock_quantity, categories) VALUES (${name}, ${price}, ${uploadResult.secure_url}, ${stock_quantity}, ${categories}) RETURNING *;
        `;

        console.log("Success inserting ", newProduct[0]);
        res.status(201).json({ success: true, data: newProduct[0] });
    } catch (error) {
        console.log("Error in createNewProduct ", error);
        res.status(500).json({ message: "Internal Server Error ", error: error.message });
    }

}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const searchForProduct = await db`
            SELECT * FROM product WHERE id = ${id};
            `;

        if (searchForProduct.length === 0) {
            console.log("No product found")
            return res.status(404).json({ success: false, message: "No Product found" });
        }
        else {
            const productId = searchForProduct[0].image.split("/").pop().split(".")[0];

            try {
                await cloudinary.uploader.destroy(`productsImage/${productId}`);
            } catch (error) {
                console.log("Error destroyning image inside cloudinary ", error);
                return res.status(500).json({ success: false, message: "Error deleting product" })
            }

            const deletedProduct = await db`
                DELETE FROM product WHERE id = ${id} RETURNING *;
            `;

            res.status(200).json({ success: true, data: deletedProduct });
        }

    } catch (error) {
        console.log("Error inside deleteProduct", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }


}

export const getCategoryProducts = async (req, res) => {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const PAGE_LIMIT = 6;
    const offset = (page - 1) * PAGE_LIMIT;
    const sort = req.query.sort;
    let orderBy = "";

    const [{ count }] = await db`
        SELECT COUNT(*) AS count FROM product WHERE categories ILIKE ${category} AND displayed_product = TRUE;
    `
    if (count === 0) return res.status(404).json({ success: false, message: `No Product found with ${category}` });

    if (sort === "price_asc") {
        orderBy = "price ASC";
    } else if (sort === "price_desc") {
        orderBy = "price DESC";
    }


    try {
        let query = `
            SELECT id, name, price, image, stock_quantity, categories FROM product WHERE categories ILIKE '${category}' AND displayed_product = TRUE
        `;


        if (orderBy) {
            query += ` ORDER BY ${orderBy}`;
        }


        query += ` 
            OFFSET ${offset}
            LIMIT ${PAGE_LIMIT}`


        const categoryProduct = await db(query);
        res.status(200).json({ success: true, data: categoryProduct, totalPages: Math.ceil(count / PAGE_LIMIT) });
    } catch (error) {
        console.log("Error in getCategoryProducts ", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });

    }
}

export const getProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await db`
            SELECT * from product WHERE id = ${id} 
        `;

        if (product.length === 0) { //No product found
            return res.status(404).json({ success: false, message: "No product found!" })
        }

        res.status(200).json({ success: true, data: product });


    } catch (error) {
        console.log("Error in getProduct ", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

