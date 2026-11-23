export function openRazorpayCheckout({ keyId, orderId, amount, planName, onSuccess, onFailed, onDismiss }) {
    const rzp = new window.Razorpay({
        key: keyId,
        order_id: orderId,
        amount,
        currency: 'INR',
        name: 'DevToolBox',
        description: `${planName} plan`,
        theme: { color: '#06b6d4' },
        handler: onSuccess,
        modal: { ondismiss: onDismiss },
    });
    if (onFailed) rzp.on('payment.failed', onFailed);
    rzp.open();
}