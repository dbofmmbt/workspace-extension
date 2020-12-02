import Close from "../shared/Close";
import Open from "../shared/Open";
import { Tab } from "./Tab";

export interface Window extends Open, Close {
    // List of tabs in the order they appear in the window
    tabs: Array<Tab>;
}

// TODO implement interface
