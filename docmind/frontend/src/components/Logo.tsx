// 1. Import ảnh từ assets
import logoImg from '../assets/logo-docmindAI.png'; 

export default function Logo({ className = "w-10 h-10" }) {
  return (
    <img
      src={logoImg}
      alt="DOCMIND AI Logo"
      className={`object-contain rounded-lg shadow-sm ${className}`}
    />
  );
}