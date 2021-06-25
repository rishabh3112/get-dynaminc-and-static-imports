import express from "express";
import { getAllFiles } from "./utils/getAllFiles";
import { getAllChunks, clearStore } from "./utils/getAllChunks";

const createApp = (root) => {
    const app = express();
    app.use(express.json());

    app.post('/chunks', async (req, res) => {
        const body = req.body;
        const tree = await getAllChunks(body.path).then((tree) => {
            clearStore();
            return tree;
        });
        const response = JSON.stringify({
            tree,
            chunks: tree.chunks,
        }, (_, value) => {
            // Stringify Set
            if (typeof value === 'object' && value instanceof Set) {
                return [...value];
            }
            return value;        
        });
        res.json(JSON.parse(response));
    });

    app.get('/files', async (_, res) => {
        const files = await getAllFiles(root);
        res.send({
            directory: root,
            files,
        });
    });

    return app;
}

export default createApp;
