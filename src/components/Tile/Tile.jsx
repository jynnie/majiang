import "./Tile.css";
import PlayTile from "./PlayTile";
import OpenTile from "./OpenTile";
import ClosedTile from "./ClosedTile";

const Tile = PlayTile;
Tile.Open = OpenTile;
Tile.Closed = ClosedTile;

export default Tile;
