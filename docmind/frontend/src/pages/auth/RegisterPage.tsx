import React, { useState, useEffect } from 'react';
import { Form, Input, Button, ConfigProvider } from 'antd';
import { MailOutlined, LockOutlined, UserOutlined, ArrowRightOutlined, LoginOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';

type StateType = 'default' | 'error' | 'success';

interface UserData {
  fullName: string;
  email: string;
}

export const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const [currentState, setCurrentState] = useState<StateType>('default');
  const [loading, setLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<UserData>({
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@docmind.vn',
  });
  
  // State theo dõi trạng thái cuộn trang để làm mượt giao diện
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Điều khiển State Switcher Inspector
  const handleStateChange = (state: StateType) => {
    setCurrentState(state);
    form.resetFields();

    if (state === 'default') {
      form.setFieldsValue({ fullName: '', email: '', password: '', confirmPassword: '' });
    } else if (state === 'error') {
      form.setFieldsValue({
        fullName: '',
        email: 'alex.nguyen@docmind.vn',
        password: 'pass1',
        confirmPassword: 'pass2',
      });
      // Kích hoạt hiển thị các lỗi validation
      form.validateFields();
    } else if (state === 'success') {
      const currentValues = form.getFieldsValue();
      setRegisteredUser({
        fullName: currentValues.fullName || 'Nguyễn Văn An',
        email: currentValues.email || 'an.nguyen@docmind.vn',
      });
    }
  };

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRegisteredUser({
        fullName: values.fullName,
        email: values.email,
      });
      setCurrentState('success');
    }, 1000);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 8,
          controlHeight: 44,
        },
      }}
    >
      <div className="w-full h-auto flex flex-col lg:flex-row bg-white relative ">
        {/* LEFT COLUMN: Brand Experience & Value Highlights (55%) */}
        <section className="lg:w-[55%] w-full  bg-[#eff4ff] p-8 sm:p-12 lg:py-8 lg:px-14 flex flex-col justify-between relative">
          {/* Ambient Glow Decorator */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-6">
            {/* Logo Brand & Badge */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <Logo className="w-10 h-10" />
                <div className="flex flex-col">
                  <span className="font-bold text-xl tracking-tight text-[#0b1c30] flex items-center gap-1.5">
                    DOCMIND <span className="text-[#4f46e5] text-xs uppercase tracking-wider font-mono">AI</span>
                  </span>
                  <span className="text-xs text-[#464555] font-medium">Hỏi đáp tài liệu thông minh với AI</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#e2dfff] text-[#3323cc] text-xs font-medium shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">person_add</span>
                Đăng ký thành viên mới
              </span>
            </div>

            {/* Headline & Editorial Narrative */}
            <div className="space-y-2 max-w-xl">
              <h1 className="text-3xl sm:text-4xl text-[#0b1c30] font-extrabold tracking-tight leading-tight">
                Bắt đầu khai phóng tri thức từ tài liệu của bạn
              </h1>
              <p className="text-base text-[#464555] leading-relaxed">
                Chỉ mất 30 giây để tạo tài khoản. Tận hưởng trợ lý AI phân tích tài liệu PDF thông minh với khả năng RAG tiên tiến nhất.
              </p>
            </div>

            {/* Visual Feature Highlights Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-white rounded-xl shadow-sm flex items-start gap-3 transition-transform hover:-translate-y-0.5">
                <div className="w-9 h-9 rounded-lg bg-[#e2dfff] flex items-center justify-center text-[#3525cd] shrink-0">
                  <span className="material-symbols-outlined text-xl">auto_stories</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0b1c30]">Phân tích PDF không giới hạn</p>
                  <p className="text-xs text-[#464555] mt-0.5">Xử lý đa chuyên ngành: luật, tài chính, kỹ thuật, y khoa.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-sm flex items-start gap-3 transition-transform hover:-translate-y-0.5">
                <div className="w-9 h-9 rounded-lg bg-[#e1e0ff] flex items-center justify-center text-[#4648d4] shrink-0">
                  <span className="material-symbols-outlined text-xl">find_in_page</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0b1c30]">Trích xuất kèm số trang 100%</p>
                  <p className="text-xs text-[#464555] mt-0.5">Mọi câu trả lời đều có trích dẫn nguồn chuẩn xác, chống ảo giác.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-sm flex items-start gap-3 transition-transform hover:-translate-y-0.5">
                <div className="w-9 h-9 rounded-lg bg-[#c9e6ff] flex items-center justify-center text-[#004d70] shrink-0">
                  <span className="material-symbols-outlined text-xl">encrypted</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0b1c30]">Bảo mật chuẩn doanh nghiệp</p>
                  <p className="text-xs text-[#464555] mt-0.5">Mã hóa AES-256 đầu cuối, tuân thủ lưu trữ dữ liệu cách ly.</p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl shadow-sm flex items-start gap-3 transition-transform hover:-translate-y-0.5">
                <div className="w-9 h-9 rounded-lg bg-[#d3e4fe] flex items-center justify-center text-[#4f46e5] shrink-0">
                  <span className="material-symbols-outlined text-xl">credit_card_off</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#0b1c30]">Miễn phí trải nghiệm ngay</p>
                  <p className="text-xs text-[#464555] mt-0.5">Không yêu cầu thẻ tín dụng, kích hoạt không gian làm việc tức thì.</p>
                </div>
              </div>
            </div>

            {/* RAG Document Workflow Graphic Card */}
            <div className="p-4 bg-white rounded-xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]"></span>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#464555]">Quy trình RAG Architecture</span>
                </div>
                <span className="font-mono text-xs text-[#3525cd] font-medium">Multi-vector Indexing</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                <div className="p-3 bg-[#eff4ff] rounded-lg flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[#464555]">
                    <span className="font-mono text-xs text-[#3525cd] font-semibold">01</span>
                    <span className="material-symbols-outlined text-lg">upload_file</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0b1c30]">Tải PDF</span>
                  <span className="text-[11px] text-[#464555] leading-tight">OCR &amp; cấu trúc hóa</span>
                </div>

                <div className="p-3 bg-[#eff4ff] rounded-lg flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[#464555]">
                    <span className="font-mono text-xs text-[#3525cd] font-semibold">02</span>
                    <span className="material-symbols-outlined text-lg">hub</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0b1c30]">Vectorize</span>
                  <span className="text-[11px] text-[#464555] leading-tight">Chunking &amp; Embeddings</span>
                </div>

                <div className="p-3 bg-[#eff4ff] rounded-lg flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[#464555]">
                    <span className="font-mono text-xs text-[#3525cd] font-semibold">03</span>
                    <span className="material-symbols-outlined text-lg">psychology</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0b1c30]">Hỏi đáp</span>
                  <span className="text-[11px] text-[#464555] leading-tight">Truy vấn ngữ nghĩa sâu</span>
                </div>

                <div className="p-3 bg-[#eff4ff] rounded-lg flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[#464555]">
                    <span className="font-mono text-xs text-[#3525cd] font-semibold">04</span>
                    <span className="material-symbols-outlined text-lg">verified</span>
                  </div>
                  <span className="text-xs font-semibold text-[#0b1c30]">Trích dẫn</span>
                  <span className="text-[11px] text-[#464555] leading-tight">Kiểm chứng từng câu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicator Micro-footer */}
          <div className="relative z-10 flex items-center gap-2 text-[#464555]">
            <span className="material-symbols-outlined text-base text-[#4f46e5]">verified_user</span>
            <span className="text-xs">Được tin dùng bởi hơn 25,000+ chuyên gia pháp lý, nghiên cứu sinh và nhà phân tích dữ liệu.</span>
          </div>
        </section>

        {/* RIGHT COLUMN: Registration Workspace (45%) */}
        <section className="lg:w-[45%] w-full bg-white p-6 sm:p-10 lg:py-6 lg:px-12 lg:sticky lg:top-0 flex flex-col justify-center items-center">
          <div 
            className={`max-w-[440px] w-full flex flex-col gap-4 my-auto transition-all ease-in-out delay-100 duration-300 ${
              isScrolled ? ' translate-y-0' : 'translate-y-3'
            }`}
          >
            {/* State Switcher Control Bar */}
            <div className="w-full p-1.5 bg-[#dce9ff] rounded-xl flex items-center justify-between gap-1 shadow-sm">
              <button
                type="button"
                onClick={() => handleStateChange('default')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-center text-xs transition-all ${
                  currentState === 'default'
                    ? 'bg-white text-[#0b1c30] font-semibold shadow-sm'
                    : 'text-[#464555] font-medium hover:text-[#0b1c30]'
                }`}
              >
                Mặc định
              </button>
              <button
                type="button"
                onClick={() => handleStateChange('error')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-center text-xs transition-all ${
                  currentState === 'error'
                    ? 'bg-white text-[#0b1c30] font-semibold shadow-sm'
                    : 'text-[#464555] font-medium hover:text-[#0b1c30]'
                }`}
              >
                Lỗi Validation
              </button>
              <button
                type="button"
                onClick={() => handleStateChange('success')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-center text-xs transition-all ${
                  currentState === 'success'
                    ? 'bg-white text-[#0b1c30] font-semibold shadow-sm'
                    : 'text-[#464555] font-medium hover:text-[#0b1c30]'
                }`}
              >
                Thành công
              </button>
            </div>

            {/* CARD CONTAINER */}
            <div className="w-full bg-white rounded-2xl p-5 border border-gray-100 shadow-md">
                {currentState !== 'success' ? (
                    /* FORM VIEW */
                    <div className="flex flex-col gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-[#0b1c30] tracking-tight">
                        Tạo tài khoản DOCMIND AI
                        </h2>
                        <p className="text-xs text-[#464555] mt-0.5">
                        Bắt đầu khám phá tài liệu của bạn cùng trợ lý AI
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        requiredMark="optional"
                    >
                        {/* Field: Họ và tên */}
                        <Form.Item
                        label={<span className="font-medium text-xs text-[#0b1c30]">Họ và tên <span className="text-red-500">*</span></span>}
                        name="fullName"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                        className="!mb-2.5"
                        >
                        <Input
                            prefix={<UserOutlined className="text-gray-400 mr-1" />}
                            placeholder="Nhập họ và tên"
                            className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm"
                        />
                        </Form.Item>

                        {/* Field: Email */}
                        <Form.Item
                        label={<span className="font-medium text-xs text-[#0b1c30]">Email <span className="text-red-500">*</span></span>}
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập địa chỉ email' },
                            { type: 'email', message: 'Email đã được sử dụng hoặc không hợp lệ' },
                        ]}
                        className="!mb-2.5"
                        >
                        <Input
                            prefix={<MailOutlined className="text-gray-400 mr-1" />}
                            placeholder="Nhập địa chỉ email"
                            className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm"
                        />
                        </Form.Item>

                        {/* Field: Mật khẩu */}
                        <Form.Item
                        label={<span className="font-medium text-xs text-[#0b1c30]">Mật khẩu <span className="text-red-500">*</span></span>}
                        name="password"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu' },
                            { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
                        ]}
                        className="!mb-2.5"
                        >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400 mr-1" />}
                            placeholder="Tạo mật khẩu"
                            className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm"
                        />
                        </Form.Item>

                        {/* Field: Xác nhận mật khẩu */}
                        <Form.Item
                        label={<span className="font-medium text-xs text-[#0b1c30]">Xác nhận mật khẩu <span className="text-red-500">*</span></span>}
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                            ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                            },
                            }),
                        ]}
                        className="!mb-3"
                        >
                        <Input.Password
                            prefix={<LockOutlined className="text-gray-400 mr-1" />}
                            placeholder="Nhập lại mật khẩu"
                            className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm"
                        />
                        </Form.Item>

                        {/* System Guard Notice */}
                        <div className="p-2 bg-[#eff4ff] rounded-lg flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-base text-[#4f46e5]">shield</span>
                        <span className="text-[11px] text-[#464555]">
                            Quyền truy cập cá nhân: <strong className="text-[#0b1c30]">ROLE_USER</strong> • Trạng thái: <strong className="text-[#0b1c30]">ACTIVE</strong>
                        </span>
                        </div>

                        {/* Submit Button */}
                        <Form.Item className="!mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            className="h-10 font-medium bg-[#4f46e5] hover:!bg-[#3525cd] border-none shadow-md flex items-center justify-center gap-2"
                        >
                            <span>Tạo tài khoản</span>
                            <ArrowRightOutlined />
                        </Button>
                        </Form.Item>
                    </Form>

                    {/* Footer Login Switch */}
                    <div className="text-center pt-0.5">
                        <span className="text-xs text-[#464555]">Đã có tài khoản? </span>
                        <Link to="/login" className="text-xs font-semibold text-[#3525cd] hover:underline">
                        Đăng nhập
                        </Link>
                    </div>
                    </div>
                ) : (
                    /* SUCCESS RESULT VIEW */
                    <div className="py-2 flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#d3e4fe] flex items-center justify-center text-[#3525cd] shadow-sm">
                        <span className="material-symbols-outlined text-3xl font-bold">check_circle</span>
                    </div>

                    <div className="space-y-1 max-w-sm">
                        <h3 className="text-lg font-bold text-[#0b1c30]">
                        Đăng ký tài khoản thành công
                        </h3>
                        <p className="text-xs text-[#464555] leading-relaxed">
                        Tài khoản của bạn đã được tạo. Bạn có thể đăng nhập để bắt đầu sử dụng DOCMIND AI.
                        </p>
                    </div>

                    {/* Profile Summary Card */}
                    <div className="w-full p-3 bg-[#eff4ff] rounded-xl text-left space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                        <span className="text-[#464555]">Người dùng:</span>
                        <span className="text-[#0b1c30] font-semibold">{registeredUser.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                        <span className="text-[#464555]">Email xác thực:</span>
                        <span className="text-[#0b1c30] font-mono">{registeredUser.email}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                        <span className="text-[#464555]">Cấp quyền:</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#e1e0ff] text-[#07006c] font-mono text-[11px] font-medium">
                            ROLE_USER
                        </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex flex-col gap-2 pt-1">
                        <Button
                        type="primary"
                        block
                        onClick={() => navigate('/login')}
                        className="h-10 font-medium bg-[#4f46e5] hover:!bg-[#3525cd] border-none shadow-md flex items-center justify-center gap-2"
                        >
                        <span>Đăng nhập ngay</span>
                        <LoginOutlined />
                        </Button>
                        <Button
                        type="default"
                        block
                        onClick={() => handleStateChange('default')}
                        className="h-9 bg-[#dce9ff] hover:bg-[#d3e4fe] text-[#0b1c30] border-none font-medium text-xs"
                        >
                        Tạo thêm tài khoản khác
                        </Button>
                    </div>
                    </div>
                )}
                </div>

            {/* Privacy & Term Links Microcopy */}
            <p className="text-center text-xs text-[#464555]">
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <a href="#" className="text-[#3525cd] underline hover:text-[#4648d4]">Điều khoản dịch vụ</a>{' '}
              và{' '}
              <a href="#" className="text-[#3525cd] underline hover:text-[#4648d4]">Chính sách bảo mật</a>{' '}
              của DOCMIND AI.
            </p>
          </div>
        </section>
      </div>
    </ConfigProvider>
  );
};