const PaymentOption = ({ method, onChange, currency }) => {
  const methods = [
    { id: 'card', name: 'Credit/Debit Card', supportedCurrencies: ['usd', 'aud', 'eur', 'gbp'] },
    { id: 'afterpay_clearpay', name: 'Pay Later with Afterpay', supportedCurrencies: ['aud', 'nzd', 'gbp'] },
    { id: 'klarna', name: 'Pay with Klarna', supportedCurrencies: ['eur','aud', 'gbp', 'usd', 'sek', 'nok', 'dkk'] },
  ];

  const lowerCurrency = currency.toLowerCase();

  return (
    <div className="space-y-2">
      {methods.map((pm) => {
        const disabled = !pm.supportedCurrencies.includes(lowerCurrency);

        return (
          <div key={pm.id} className="flex items-center opacity-100">
            <input
              id={pm.id}
              name="payment-method"
              type="radio"
              disabled={disabled}
              checked={method === pm.id}
              onChange={() => onChange(pm.id)}
              className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
            />
            <label htmlFor={pm.id} className={`ml-3 block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              {pm.name} {disabled && <span className="text-xs text-red-500 ml-1">(Not available in {currency.toUpperCase()})</span>}
            </label>
          </div>
        );
      })}
    </div>
  );
};
export default PaymentOption;
