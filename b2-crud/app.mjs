import express from 'express';

import mainController from './src/controllers/mainController.mjs';

const port = 777;

mainController.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});