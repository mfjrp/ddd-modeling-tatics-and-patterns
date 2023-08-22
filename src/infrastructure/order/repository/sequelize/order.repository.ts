import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity
            })),
        },
        {
            include: [{ model: OrderItemModel }],
        });
    }

    async update(entity: Order): Promise<void> {
        logging: console.log;
        const sequelize = OrderModel.sequelize;

        try {
            await sequelize.transaction(async (t) => {
                await OrderItemModel.destroy({
                    where: { order_id: entity.id },
                    transaction: t,
                });

                const orderItems = entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                    order_id: entity.id,
                }));

                await OrderItemModel.bulkCreate(orderItems, { transaction: t });
                await OrderModel.update(
                    { total: entity.total() },
                    { where: { id: entity.id }, transaction: t }
                );
            });
        } catch (error) {
            console.log(error);
            throw new Error("Error updating order.");
        }

        await OrderModel.update(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity
                })),
            },
            {
                where: {
                    id: entity.id,
                }
            },
        );
    }

    async find(id: string): Promise<Order> {
        let orderModel;
        let orderItems: OrderItem[] = [];
        try {
            orderModel = await OrderModel.findOne({
                where: {
                    id,
                },
                include: [OrderItemModel],
                rejectOnEmpty: true,
            });
        } catch (error) {
            throw new Error("Order not found");
        }

        orderModel.items.forEach((item) => {
            orderItems.push(new OrderItem(
                item.id,
                item.name,
                item.price,
                item.product_id,
                item.quantity
            ));
        });

        const order = new Order(id, orderModel.customer_id, orderItems);
        return order;
    }

    async findAll(): Promise<Order[]> {
        try {
            const orders = await OrderModel.findAll({
                include: [OrderItemModel]
            });

            return orders.map((orderModel) => {
                const items: OrderItem[] = [];

                orderModel.items.forEach((item) => {
                    items.push(
                        new OrderItem(
                            item.id,
                            item.name,
                            item.price,
                            item.product_id,
                            item.quantity
                        )
                    );
                });

                return new Order(orderModel.id, orderModel.customer_id, items);
            });

        } catch (error) {
            console.log(error);
            throw new Error("Error retrieving orders");
        }

        return null;
    }

}