type JsonifiedValue<T> = T extends string | number | null | boolean // Kiểm tra nếu T là kiểu cơ bản được JSON hỗ trợ
  ? T // Nếu đúng, trả về chính T
  : T extends { toJSON(): infer R } // Nếu T có phương thức `toJSON`, sử dụng kiểu trả về của phương thức này
  ? R
  : T extends undefined | ((...args: any[]) => any) // Nếu T là undefined hoặc hàm
  ? never // Loại bỏ giá trị này (JSON không hỗ trợ)
  : T extends object // Nếu T là object
  ? JsonifiedObject<T> // Gọi đệ quy để xử lý object
  : never; // Các trường hợp còn lại không hợp lệ

// JsonifiedObject sẽ loại bỏ các key mà giá trị không hợp lệ trong JSON
// Và với các key còn lại, sẽ áp dụng JsonifiedValue để chuyển đổi kiểu dữ liệu.
type JsonifiedObject<T> = {
  [Key in keyof T as [JsonifiedValue<T[Key]>] extends [never]
    ? never
    : Key]: JsonifiedValue<T[Key]>;
};

// Kiểu Stringified là một chuỗi (string) được gắn thêm thông tin về nguồn dữ liệu ban đầu (`ObjType`).
type Stringified<ObjType> = string & { source: ObjType };

interface JSON {
  // Định nghĩa lại JSON.stringify để trả về kiểu Stringified<T>, kèm theo nguồn gốc của dữ liệu.
  stringify<T>(
    value: T,
    replacer?: null | undefined,
    space?: string | number
  ): Stringified<T>;

  // Định nghĩa lại JSON.parse để chuyển đổi chuỗi Stringified<T> thành JsonifiedObject<T>.
  parse<T>(
    str: Stringified<T>,
    replacer?: null | undefined
  ): JsonifiedObject<T>;
}
