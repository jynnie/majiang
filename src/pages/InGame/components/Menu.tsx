import React from "react";
import Box from "ui-box";

import { EngineContext } from "../../../App";

import "./Menu.css";

const Menu = () => {
  const { GE } = React.useContext(EngineContext);

  const [showMenu, setShowMenu] = React.useState(false);
  const [menuOption, setMenuOption] = React.useState<string | null>(null);

  const ref = React.useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    if (ref?.current) ref.current.classList.add("Menu-fadeOut");
    setMenuOption(null);

    setTimeout(() => {
      setShowMenu(!showMenu);
      if (ref?.current) ref.current.classList.remove("Menu-fadeOut");
    }, 200);
  };
  const handleLeave = () => setMenuOption("leave");
  const handleRestart = () => setMenuOption("restart");
  const handleConfirm = () => {
    if (menuOption === "restart") GE.returnToLobby();
    if (menuOption === "leave") GE.leaveRoom();
  };

  return (
    <>
      {showMenu && (
        <Box className="Menu-container" ref={ref}>
          <img className="Menu-background" src="/Brushes/InkBrush.svg" alt="" />
          <Box className="Menu-content">
            {!menuOption && (
              <>
                <button className="Menu-button" onClick={handleLeave}>
                  leave game
                </button>
                {GE.isHost && (
                  <button className="Menu-button" onClick={handleRestart}>
                    restart
                  </button>
                )}
              </>
            )}
            {menuOption && (
              <button className="Menu-button" onClick={handleConfirm}>
                confirm
              </button>
            )}
            <button className="Menu-button" onClick={toggleMenu}>
              cancel
            </button>
          </Box>
        </Box>
      )}
      <button className="Menu-button Menu-openButton" onClick={toggleMenu}>
        ?
      </button>{" "}
    </>
  );
};

export default Menu;
