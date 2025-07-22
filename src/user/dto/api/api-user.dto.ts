import { ApiDto } from '../../../shared/dto/api.dto';

class ApiUserDto extends ApiDto {


  private _id: number;
  private _userId: string;
  private _isNew: boolean;
  private _password: string;

  constructor(props: any) {
    super(props);
    this._id = props.id;
    this._userId = props.uid;
    this._password = props.password;
    this._isNew = props.isNew;
  }

  get isNew() {
    return this._isNew;
  }

  set isNew(value) {
    this._isNew = value || false;
  }

  get userId() {
    return this._userId;
  }

  set userId(value) {
    this._userId = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }
}

export default ApiUserDto;
