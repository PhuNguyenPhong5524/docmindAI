import api from "../lib/api";

export const getAllUsers = async () => {
  try {
    // Gọi thẳng vào đường link Backend bạn vừa sửa lúc nãy
    const { data } = await api.get('/api/admin/users');
    return data;
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
    return [];
  }
};