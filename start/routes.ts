/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('/register', 'AccountsController.newAccount')
Route.post('/login', 'AccountsController.login')
Route.post('/newPasswordRequest', 'AccountsController.requestNewPassword')
Route.get('/newPassword/:code', 'AccountsController.reestablecerPassword')

Route.group(() => {
    Route.post('/newMarca', 'MarcasController.registrarMarca');
    Route.post('/newDepartamento', 'DepartamentsController.registrarDepartamento');
    Route.get('/marcasydepartamentos', 'ProductsController.marcasydepartamentos');
    Route.delete('/eliminarDepartamento/:id', 'DepartamentsController.eliminardeparamento');
    Route.delete('/eliminarMarca/:id', 'MarcasController.eliminarMarca');
    Route.post('/newProduct', 'ProductsController.agregarProducto');
    Route.get('/getProducts', 'ProductsController.getProducts');
    Route.post('/newVenta', 'CajasController.venta')
}).prefix('api').middleware('auth');

