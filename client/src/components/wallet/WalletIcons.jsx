const Frame = ({ bg = "#fff", children }) => (
  <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <rect width="40" height="40" rx="10" fill={bg} />
    {children}
  </svg>
);

export const WalletIcon = ({ id }) => {
  switch (id) {
    case "metamask":
      return (
        <Frame>
          <polygon fill="#E2761B" points="8.6,9.8 19.8,18.2 18.2,13.8" />
          <polygon fill="#E4761B" points="31.4,9.8 20.2,18.2 21.8,13.8" />
          <polygon fill="#E2761B" points="11.8,18.4 17.8,18.6 16.6,22.6 13.2,21.4" />
          <polygon fill="#E2761B" points="28.2,18.4 22.2,18.6 23.4,22.6 26.8,21.4" />
          <polygon fill="#D7C1B3" points="16.8,25.8 17.8,28.8 20,28.2 22.2,28.8 23.2,25.8 20,24.6" />
          <polygon fill="#233447" points="16.6,22.8 13.2,21.4 17.6,20.8" />
          <polygon fill="#233447" points="23.4,22.8 22.4,20.8 26.8,21.4" />
          <polygon fill="#E4751F" points="12.4,24.6 16.8,25.8 16,28.6 11.8,28.8" />
          <polygon fill="#E4751F" points="27.6,24.6 28.2,28.8 24,28.6 23.2,25.8" />
          <polygon fill="#F6851B" points="16.8,25.8 20,24.6 23.2,25.8 22.2,27.4 20,27 17.8,27.4" />
          <polygon fill="#763D16" points="8.6,9.8 11.8,18.4 16.6,22.8 17.8,18.6 19.8,18.2" />
          <polygon fill="#763D16" points="31.4,9.8 20.2,18.2 22.2,18.6 23.4,22.8 28.2,18.4" />
          <polygon fill="#C0AD9E" points="17.4,23.6 16.6,22.8 20,21.8 23.4,22.8 22.6,23.6 20,23" />
          <polygon fill="#161616" points="16,28.6 16.4,30.2 19.6,30.4 19.8,28.2" />
          <polygon fill="#161616" points="24,28.6 20.2,28.2 20.4,30.4 23.6,30.2" />
        </Frame>
      );
    case "coinbase":
      return (
        <Frame bg="#0052FF">
          <path fill="#fff" d="M20 11a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm0 13.2A4.2 4.2 0 1 1 24.2 20 4.2 4.2 0 0 1 20 24.2Z" />
        </Frame>
      );
    case "rabby":
      return (
        <Frame bg="#7084FF">
          <ellipse cx="13.8" cy="15.5" rx="3.6" ry="7" fill="#fff" transform="rotate(-20 13.8 15.5)" />
          <ellipse cx="26.2" cy="15.5" rx="3.6" ry="7" fill="#fff" transform="rotate(20 26.2 15.5)" />
          <circle cx="20" cy="23.2" r="8" fill="#fff" />
          <circle cx="17.1" cy="22.4" r="1.35" fill="#2A2A4A" />
          <circle cx="22.9" cy="22.4" r="1.35" fill="#2A2A4A" />
          <path d="M17.8 26.2c1.5 1.1 2.9 1.1 4.4 0" stroke="#2A2A4A" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </Frame>
      );
    case "brave":
      return (
        <Frame bg="#FF2000">
          <path fill="#fff" d="M20 8.8 11.6 12.2 10 21.4 20 31.4 30 21.4 28.4 12.2 20 8.8Zm0 3.4 6 2.3-1.7 8.6L20 27.2l-4.3-4.1-1.7-8.6 6-2.3Z" />
        </Frame>
      );
    case "trust":
      return (
        <Frame bg="#0500FF">
          <path fill="#fff" d="M20 8 10.5 12v8.4c0 6.3 4.1 11 9.5 12.4 5.4-1.4 9.5-6.1 9.5-12.4V12L20 8Zm0 4.6 5.9 2.4v5.4c0 3.7-2.4 6.6-5.9 7.8-3.5-1.2-5.9-4.1-5.9-7.8v-5.4L20 12.6Z" />
        </Frame>
      );
    case "okx":
      return (
        <Frame bg="#000">
          <path fill="#fff" d="M11.5 11.5h7v7h-7v-7Zm10 0h7v7h-7v-7Zm-10 10h7v7h-7v-7Zm10 0h7v7h-7v-7Z" />
        </Frame>
      );
    case "phantom":
      return (
        <Frame bg="#AB9FF2">
          <path fill="#fff" d="M11.2 17.6c0-5.2 3.9-8.6 8.8-8.6 5.1 0 8.8 3.5 8.8 8.8v7.1c0 1.2-.6 1.9-1.7 1.9h-6c-.5 2.9-2.1 4.4-4.5 4.4-2.7 0-4.4-1.9-4.4-5 0-2.7 1.5-4.4 3.9-4.9v-3.7c0-1.5.9-2.5 2.4-2.5 1.3 0 2.2.9 2.2 2.2v5.2h2.6v-5.4c0-3-1.9-4.9-4.9-4.9-3.1 0-5.3 2.2-5.3 6.1v.4h-1.9v-1.1Z" />
          <circle cx="24.6" cy="19.3" r="1.1" fill="#5347A0" />
        </Frame>
      );
    default:
      return (
        <Frame bg="#0E3A52">
          <path fill="#7EC8EA" d="M13 16.8h14v10.8a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2V16.8Zm3.2-3.2h7.6a1.2 1.2 0 0 1 1.2 1.2v2H15v-2a1.2 1.2 0 0 1 1.2-1.2Z" />
        </Frame>
      );
  }
};
