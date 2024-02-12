import { useEffect, useState } from "react";

const useScroll = () => {
  const [shouldShowScrollButton, setShouldShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShouldShowScrollButton(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return shouldShowScrollButton;
};

export default useScroll;
