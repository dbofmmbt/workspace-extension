import Close from "../../shared/Close";
import Open from "../../shared/Open";

export interface Tab extends Open, Close {
    url: string;
}

