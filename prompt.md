Створи мені бібліотеку, окремий npm пакет. Назву придумай.
Потрібно щоб він працював з будь-якою sql бібліотекою для ноди. Тобто саме підключення передається ззовні при ініціалізації. Що він має вміти. він має вміти конветувати sql шаблони у js функції, заваннтажувати sql файли, перетворювати у шаблон та теж ковертувати у функції.
Приклад
const findOne = sql`select name from user id=$(id):integer`
має перетворитиця на функцію що приймає об'єкт параметрів, перевіряє типізацію та повертає проміс запиту
const user = await findOne({id: 1});
також має працюєвати js плейсхолдери

Приклад
const findOne = sql`select name from user id=${prop => prop.id}:integer`

Цей синкасис має підтримуватись при загрузці із sql файлів.

Приклад загрузки
const findOne = sql.fromFile(filePath)

Якщо у sql файлі/шаблоні sql schema то має создаватися класс модель він знає таблицю, поля, може валідувати поля екземплярів.

Приклад загрузки
const Product = sql.fromFile(filePath)

const user = await Product.findOne({id: 1}); // Це проксі для findOne.bind(Product) чи шось таке

Має бути піддтримка Views 

