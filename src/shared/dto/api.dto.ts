export class ApiDto {
  private _uid: string;
  private _props: unknown;
  constructor(props: any) {
    this._props = props;
    this._uid = props.uid;
  }

  get props(): unknown {
    return this._props;
  }

  set props(value: unknown) {
    this._props = value;
  }

  get uid() {
    return this._uid;
  }

  set uid(value) {
    this._uid = value;
  }
}