import { useNavigate } from 'react-router-dom';

export default function Payment() {
  const navigate = useNavigate();

  const handlePayment = () => {
    alert("✅ Payment successful!");
    navigate('/');
  };

  return (
    <div>
      <h2>Payment</h2>
      <p>This is a dummy payment. Click below to complete your order.</p>
      <button name="confirm-button" onClick={handlePayment}>Confirm</button>
    </div>
  );
}