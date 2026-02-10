interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.13 6.742 3.046 9.378L1.054 31.29l6.118-1.958A15.914 15.914 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.302 22.612c-.39 1.1-1.932 2.014-3.18 2.28-.854.18-1.968.324-5.72-1.23-4.802-1.988-7.894-6.862-8.132-7.182-.228-.32-1.916-2.552-1.916-4.866 0-2.314 1.212-3.452 1.642-3.924.39-.428 1.028-.624 1.64-.624.198 0 .376.01.536.018.47.02.706.048 1.016.786.39.924 1.338 3.268 1.456 3.506.12.238.2.516.04.826-.148.32-.228.516-.456.792-.228.278-.48.62-.684.83-.228.238-.466.496-.2.968.266.47 1.182 1.95 2.538 3.16 1.742 1.554 3.21 2.036 3.666 2.262.342.17.75.14 1.026-.148.348-.366.778-.972 1.216-1.57.312-.426.706-.48 1.086-.326.386.148 2.442 1.152 2.862 1.362.42.21.7.316.802.488.1.172.1.996-.29 2.096z"
      />
    </svg>
  );
}

export function WhatsAppButton({ 
  phoneNumber = "5543991741518", 
  message = "Olá! Gostaria de saber mais sobre os serviços de impressão 3D." 
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float group"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7 text-white" />
      <span className="absolute right-full mr-3 px-3 py-2 bg-white text-foreground text-sm font-medium rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Fale conosco
      </span>
    </a>
  );
}
