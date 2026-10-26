// ======================================================
// OBSERVER PATTERN
// ======================================================

// Observer
class User {
    constructor(name) {
        this.name = name;
    }

    update(productName, oldPrice, newPrice) {
        const message =
            `🔔 ${this.name}, ${productName} price dropped from ₹${oldPrice} to ₹${newPrice}!`;

        document.getElementById("notification").innerText = message;
    }
}


// Subject
class Product {
    constructor(name, price) {
        this.name = name;
        this.price = price;
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    setPrice(newPrice) {
        const oldPrice = this.price;
        this.price = newPrice;

        document.getElementById("price").innerText = newPrice;

        this.notify(oldPrice, newPrice);
    }

    notify(oldPrice, newPrice) {
        this.observers.forEach(observer => {
            observer.update(this.name, oldPrice, newPrice);
        });
    }
}


// Product and User
const laptop = new Product("Premium Laptop", 50000);
const user1 = new User("Customer");

let subscribed = false;


// Subscribe
function subscribePriceDrop() {

    if (!subscribed) {
        laptop.subscribe(user1);
        subscribed = true;

        document.getElementById("notification").innerText =
            "✅ You are subscribed to price drop notifications!";
    }
}


// Price Drop
function dropPrice() {

    if (!subscribed) {
        document.getElementById("notification").innerText =
            "⚠️ Please subscribe first!";
        return;
    }

    laptop.setPrice(45000);
}



// ======================================================
// STRATEGY PATTERN
// ======================================================

// Strategy
class PaymentStrategy {

    pay(amount) {
        throw new Error("pay() method must be implemented");
    }

}


// Credit Card Strategy
class CardPayment extends PaymentStrategy {

    pay(amount) {
        return `💳 Payment of ₹${amount} completed using Credit Card.`;
    }

}


// UPI Strategy
class UPIPayment extends PaymentStrategy {

    pay(amount) {
        return `📱 Payment of ₹${amount} completed using UPI.`;
    }

}


// Wallet Strategy
class WalletPayment extends PaymentStrategy {

    pay(amount) {
        return `👛 Payment of ₹${amount} completed using Wallet.`;
    }

}


// Context
class CheckoutService {

    constructor(paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    setPaymentStrategy(paymentStrategy) {
        this.paymentStrategy = paymentStrategy;
    }

    checkout(amount) {
        return this.paymentStrategy.pay(amount);
    }

}


// Make Payment
function makePayment() {

    const selectedMethod =
        document.getElementById("paymentMethod").value;

    let strategy;


    if (selectedMethod === "card") {

        strategy = new CardPayment();

    } else if (selectedMethod === "upi") {

        strategy = new UPIPayment();

    } else if (selectedMethod === "wallet") {

        strategy = new WalletPayment();

    }


    const checkout = new CheckoutService(strategy);

    const message = checkout.checkout(45000);

    document.getElementById("paymentMessage").innerText = message;
}



// ======================================================
// COMMAND PATTERN
// ======================================================


// Receiver
class CartService {

    constructor() {
        this.items = 0;
        this.total = 0;
        this.couponApplied = false;
    }


    addItem() {

        this.items++;
        this.total += 45000;

        this.updateUI();
    }


    removeItem() {

        if (this.items > 0) {

            this.items--;
            this.total -= 45000;

            this.updateUI();

        }
    }


    applyCoupon() {

        if (!this.couponApplied && this.items > 0) {

            this.total -= 5000;
            this.couponApplied = true;

            this.updateUI();

        }
    }


    updateUI() {

        document.getElementById("cartItems").innerText =
            this.items;

        document.getElementById("cartTotal").innerText =
            this.total;
    }

}


// Command Interface
class Command {

    execute() {
        throw new Error("execute() must be implemented");
    }

    undo() {
        throw new Error("undo() must be implemented");
    }
}


// Add Item Command
class AddItemCommand extends Command {

    constructor(cart) {
        super();
        this.cart = cart;
    }

    execute() {
        this.cart.addItem();
    }

    undo() {
        this.cart.removeItem();
    }
}


// Remove Item Command
class RemoveItemCommand extends Command {

    constructor(cart) {
        super();
        this.cart = cart;
    }

    execute() {
        this.cart.removeItem();
    }

    undo() {
        this.cart.addItem();
    }
}


// Apply Coupon Command
class ApplyCouponCommand extends Command {

    constructor(cart) {
        super();
        this.cart = cart;
    }

    execute() {
        this.cart.applyCoupon();
    }

    undo() {

        if (this.cart.couponApplied) {

            this.cart.total += 5000;
            this.cart.couponApplied = false;

            this.cart.updateUI();
        }
    }
}


// Invoker
class CommandInvoker {

    constructor() {
        this.history = [];
        this.redoStack = [];
    }


    executeCommand(command) {

        command.execute();

        this.history.push(command);

        this.redoStack = [];

    }


    undo() {

        if (this.history.length === 0) {

            document.getElementById("cartMessage").innerText =
                "⚠️ Nothing to undo.";

            return;
        }


        const command = this.history.pop();

        command.undo();

        this.redoStack.push(command);


        document.getElementById("cartMessage").innerText =
            "↩️ Last action undone.";
    }


    redo() {

        if (this.redoStack.length === 0) {

            document.getElementById("cartMessage").innerText =
                "⚠️ Nothing to redo.";

            return;
        }


        const command = this.redoStack.pop();

        command.execute();

        this.history.push(command);


        document.getElementById("cartMessage").innerText =
            "↪️ Last action redone.";
    }

}


// Create Cart Receiver
const cart = new CartService();

// Create Invoker
const invoker = new CommandInvoker();


// UI Functions
function addItem() {

    const command = new AddItemCommand(cart);

    invoker.executeCommand(command);

    document.getElementById("cartMessage").innerText =
        "✅ Laptop added to cart.";
}


function removeItem() {

    const command = new RemoveItemCommand(cart);

    invoker.executeCommand(command);

    document.getElementById("cartMessage").innerText =
        "✅ Laptop removed from cart.";
}


function applyCoupon() {

    const command = new ApplyCouponCommand(cart);

    invoker.executeCommand(command);

    if (cart.couponApplied) {

        document.getElementById("cartMessage").innerText =
            "🎟️ ₹5000 coupon applied.";

    } else {

        document.getElementById("cartMessage").innerText =
            "⚠️ Add an item before applying coupon.";
    }
}


// Undo
function undoAction() {
    invoker.undo();
}


// Redo
function redoAction() {
    invoker.redo();
}