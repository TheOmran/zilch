export interface LoginInput {
  email: string
  password: string
}

export type LoginInputParams = {
  [K in keyof LoginInput]: string
}
