export default function Input({ className = '', ...props }: any) {
  return (
    <input 
      className={`w-full bg-white border border-gray-200 rounded-[12px] px-4 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors ${className}`} 
      {...props} 
    />
  );
}
