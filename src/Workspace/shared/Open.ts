/*
This interface represents the capability to be opened.

Some Open implementors could fail while opening.
This may demand this interface to change in order to
denote this possibility.
*/
export default interface Open {
  open(): Promise<void>;
}
