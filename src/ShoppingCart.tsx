import { useEffect, useReducer, useState } from "react";

// Types
interface Product {
	id: number;
	title: string;
	price: number;
	description: string;
	category: string;
	image: string;
}

interface CartItem extends Product {
	quantity: number;
}

// Cart Action Types
type CartAction =
	| { type: "ADD_ITEM"; item: Product }
	| { type: "REMOVE_ITEM"; id: number }
	| { type: "CLEAR_CART" } | { type: "INCREASE_QUANTITY"; id: number } | { type: "DECREASE_QUANTITY"; id: number };

// Reducer
const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
	switch (action.type) {
		case "ADD_ITEM":
			{
				const exists = state.find((item) => item.id === action.item.id);
				if (exists) {
					return state.map((item) =>
						item.id === action.item.id
							? { ...item, quantity: item.quantity + 1 }
							: item
					);
				}
				return [...state, { ...action.item, quantity: 1 }];
			}

		case "REMOVE_ITEM":
			return state.filter((item) => item.id !== action.id);

		case "CLEAR_CART":
			return [];

		case "INCREASE_QUANTITY":
			return state.map(item =>
				item.id === action.id
					? { ...item, quantity: item.quantity + 1 }
					: item
			);

		case "DECREASE_QUANTITY":
			return state
				.map(item =>
					item.id === action.id
						? { ...item, quantity: item.quantity - 1 }
						: item
				)
				.filter(item => item.quantity > 0); // remove if quantity becomes 0
		default:
			return state;
	}
};

const ShoppingCart = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [cart, dispatch] = useReducer(cartReducer, []);

	// Fetch products
	useEffect(() => {
		fetch("https://fakestoreapi.com/products")
			.then((res) => res.json())
			.then((data: Product[]) => setProducts(data))
			.catch((err) => console.error("Failed to fetch products:", err));
	}, []);

	return (
		products.length === 0 ? <div>Loading...</div> :
			<div style={{ display: "flex", width: "98dvw", margin: "auto", gap: "8px", padding: "8px" }}>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						width: "72dvw",
						gap: "12px",
						justifyContent: "start"
					}}
				>
					<div style={{ display: "flex", width: "100%", backgroundColor: "grey", padding: "8px" }}>
						<h3>Products:</h3>
					</div>
					{products.map((product) => (
						<div key={product.id} style={{ width: "20%", border: "1px solid #ccc", padding: "8px", position: "relative" }}>
							<img src={product.image} width="30%" height="30%" />
							<h4>{product.title}</h4>
							<p>${product.price}</p>
							<button style={{ position: "absolute", right: 8, bottom: 8 }} onClick={() => dispatch({ type: "ADD_ITEM", item: product })}>
								Add to Cart
							</button>
						</div>
					))}
				</div>
				<div style={{ width: "24dvw", height: "max-content" }}>
					{cart.length === 0 ? (
						<div style={{ display: "flex", backgroundColor: "grey", padding: "8px" }}>
							<h3>Cart is empty!</h3>
						</div>
					) : (
						<>
							<div style={{ display: "flex", backgroundColor: "grey", padding: "8px", position: "relative" }}>
								<h3>Cart:</h3>
								<button style={{ position: "absolute", right: 8 }} onClick={() => dispatch({ type: "CLEAR_CART" })}>Clear Cart</button>
							</div>
							{cart.map((item) => (
								<div key={item.id} style={{ margin: "12px" }}>
									<div key={item.id} style={{ border: "1px solid #ccc", padding: "8px", position: "relative" }}>
										<img src={item.image} width="20%" height="20%" /><br />
										<strong>{item.title}</strong> - ${item.price} x {item.quantity}<br />
										<div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
											<button onClick={() => dispatch({ type: "DECREASE_QUANTITY", id: item.id })}>-</button>
											<button onClick={() => dispatch({ type: "INCREASE_QUANTITY", id: item.id })}>+</button>
										</div>
										<h4>Total: ${item.price * item.quantity}</h4>
										<button style={{ position: "absolute", right: 8, bottom: 8, marginLeft: "8px" }} onClick={() => dispatch({ type: "REMOVE_ITEM", id: item.id })} >
											Remove
										</button>
									</div>
								</div>
							))}
							<div>
								<hr />
								<h3>Cart total: {cart.reduce((total, item) => (total + (item.price * item.quantity)), 0)}</h3>
							</div>
						</>
					)}
				</div>
			</div>
	);
};

export default ShoppingCart;
