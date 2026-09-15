import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Alert, ConfigProvider } from 'antd';
import { MailOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';

type StateType = 'default' | 'validation' | 'blocked' | 'loading';

export const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [currentState, setCurrentState] = useState<StateType>('default');
  const [loading, setLoading] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStateChange = (state: StateType) => {
    setCurrentState(state);
    form.resetFields();

    if (state === 'default') {
      form.setFieldsValue({ email: 'nguyenvana@uit.edu.vn', password: '••••••••••••' });
    } else if (state === 'validation') {
      form.setFieldsValue({ email: 'nguyenvana#uit', password: '' });
      form.validateFields();
    } else if (state === 'blocked') {
      form.setFieldsValue({ email: 'blocked.account@uit.edu.vn', password: '••••••••••••' });
    } else if (state === 'loading') {
      form.setFieldsValue({ email: 'admin@docmind.ai', password: '••••••••••••' });
      setLoading(true);
      setTimeout(() => navigate('/admin'), 1500);
    }
  };

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4f46e5',
          borderRadius: 8,
          controlHeight: 40,
        },
      }}
    >
      <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white relative items-start">
        {/* LEFT COLUMN: Nộị dung giới thiệu RAG */}
        <section className="lg:w-[55%] w-full bg-[#eff4ff] p-8 sm:p-12 lg:py-10 lg:px-14 flex flex-col justify-between relative min-h-screen">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-28 right-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 flex-wrap">
              <Logo className="w-10 h-10" />
              <div className="flex items-center gap-3">
                <span className="font-bold text-xl tracking-tight text-[#0b1c30]">DOCMIND AI</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#e2dfff] text-[#3323cc]">
                  RAG Document Intelligence
                </span>
              </div>
            </div>

            <p className="text-xs text-[#4f46e5] font-medium tracking-wide uppercase">
              Hỏi đáp tài liệu thông minh với AI
            </p>

            <h1 className="text-3xl sm:text-4xl text-[#0b1c30] font-extrabold tracking-tight max-w-xl">
              Hiểu tài liệu nhanh hơn với sức mạnh của AI
            </h1>

            <p className="text-base text-[#464555] max-w-xl leading-relaxed">
              Tải lên tài liệu PDF, đặt câu hỏi bằng ngôn ngữ tự nhiên và nhận câu trả lời dựa trên chính nội dung tài liệu của bạn với nguồn trích dẫn minh bạch từng trang.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { icon: 'chat', label: 'Hỏi đáp trực tiếp trên tài liệu' },
                { icon: 'bookmark_check', label: 'Trích dẫn chính xác theo trang' },
                { icon: 'auto_awesome', label: 'Tóm tắt nội dung bằng AI' },
                { icon: 'compare', label: 'So sánh nhiều tài liệu' },
                { icon: 'history', label: 'Lưu lịch sử hội thoại' },
              ].map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d3e4fe] text-[#0b1c30] text-xs shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-[#4f46e5]">{item.icon}</span>
                  {item.label}
                </span>
              ))}
            </div>

            {/* Live Chat Mockup Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-5 shadow-sm space-y-4 border border-indigo-50/50">
              <div className="flex items-center justify-between overflow-x-auto pb-2 text-[11px] text-[#464555] font-medium">
                <span className="inline-flex items-center gap-1 text-[#4f46e5] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">picture_as_pdf</span> PDF Documents
                </span>
                <span className="material-symbols-outlined text-[12px] text-gray-400">arrow_forward</span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">token</span> Vector Chunks
                </span>
                <span className="material-symbols-outlined text-[12px] text-gray-400">arrow_forward</span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">manage_search</span> Semantic Search
                </span>
                <span className="material-symbols-outlined text-[12px] text-gray-400">arrow_forward</span>
                <span className="inline-flex items-center gap-1 text-[#4f46e5] font-semibold">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Source Citation
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start justify-end gap-2">
                  <div className="bg-[#4f46e5] text-white px-3.5 py-2 rounded-xl rounded-tr-none text-xs shadow-sm max-w-[85%]">
                    Điều kiện xét tốt nghiệp là gì?
                  </div>
                  <span className="w-6 h-6 rounded-full bg-[#dce9ff] flex items-center justify-center text-[12px] text-[#0b1c30] font-semibold shrink-0">
                    U
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#4f46e5] flex items-center justify-center text-white text-[12px] shrink-0">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                  </div>
                  <div className="bg-[#eff4ff] text-[#0b1c30] px-4 py-3 rounded-xl rounded-tl-none text-xs space-y-2.5 max-w-[90%]">
                    <p className="leading-relaxed">
                      Theo tài liệu đã chọn, sinh viên cần hoàn thành đầy đủ chương trình đào tạo và đáp ứng các điều kiện theo quy định chuẩn đầu ra ngoại ngữ, tin học.
                    </p>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e1e0ff] text-[#3323cc] text-xs shadow-sm">
                      <span className="material-symbols-outlined text-[14px]">description</span>
                      <span className="font-medium">Quy_che_dao_tao_UIT.pdf</span>
                      <span className="text-[#464555]">· Trang 23</span>
                      <span className="bg-[#4f46e5] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">#Mục 4.2</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-[#464555]">
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#4f46e5] text-[16px]">verified_user</span>
                  <strong className="text-[#0b1c30]">99.4%</strong> Độ chính xác trích dẫn
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#4f46e5] text-[16px]">view_column</span>
                  Hỗ trợ PDF đa cột &amp; bảng biểu
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 flex items-center justify-between text-xs text-[#464555]">
            <span>Bảo mật dữ liệu chuẩn SOC2 &amp; GDPR</span>
            <span className="font-mono">v2.4.0-prod</span>
          </div>
        </section>

        {/* RIGHT COLUMN: Ghim khung cố định màn hình mượt mà */}
        <section className="lg:w-[45%] w-full bg-white p-6 sm:p-10 lg:py-8 lg:px-12 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center items-center overflow-y-auto">
          <div 
            className={`max-w-[420px] w-full flex flex-col my-auto transition-all duration-300 ease-out delay-50 ${
              isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-98'
            }`}
          >
            {/* State Inspector Control Bar */}
            <div className="w-full bg-[#eff4ff] p-2 rounded-xl mb-5 shadow-sm border border-indigo-50">
              <div className="text-[10px] font-bold tracking-wider text-[#464555] mb-1.5 flex items-center justify-between uppercase">
                <span>State Switcher Inspector</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(['default', 'validation', 'blocked', 'loading'] as StateType[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStateChange(st)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium capitalize transition-all duration-200 ${
                      currentState === st 
                        ? 'bg-white text-[#3525cd] font-semibold shadow-sm' 
                        : 'text-[#464555] hover:text-[#0b1c30] hover:bg-white/50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Title */}
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Chào mừng trở lại</h2>
              <p className="text-xs text-[#464555] mt-1">Đăng nhập để tiếp tục sử dụng DOCMIND AI</p>
            </div>

            {/* ANTD Alerts */}
            {currentState === 'blocked' && (
              <Alert
                message="Tài khoản đã bị khóa"
                description="Tài khoản của bạn hiện không thể truy cập hệ thống. Vui lòng liên hệ quản trị viên."
                type="error"
                showIcon
                className="!mb-4 rounded-lg"
              />
            )}

            {currentState === 'loading' && (
              <Alert
                message="Đang xác thực JWT & giải mã phân quyền..."
                type="info"
                icon={<LoadingOutlined />}
                showIcon
                className="!mb-4 rounded-lg"
              />
            )}

            {/* Form Ant Design với khoảng cách tối ưu */}
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ email: 'nguyenvana@uit.edu.vn', remember: true }}
              requiredMark="optional"
            >
              {/* Email Field */}
              <Form.Item
                label={<span className="font-medium text-xs text-[#0b1c30]">Email</span>}
                name="email"
                className="!mb-3.5"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Vui lòng nhập email đúng định dạng' },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400 mr-1.5" />}
                  placeholder="Nhập địa chỉ email"
                  className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm transition-all"
                />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                label={<span className="font-medium text-xs text-[#0b1c30]">Mật khẩu</span>}
                name="password"
                className="!mb-2.5"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400 mr-1.5" />}
                  placeholder="Nhập mật khẩu"
                  className="h-10 rounded-lg bg-[#eff4ff] border-none hover:bg-[#e5eeff] focus:bg-white text-sm transition-all"
                />
              </Form.Item>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between mb-4 pt-1">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-xs text-[#464555]">Ghi nhớ đăng nhập</Checkbox>
                </Form.Item>
                <a href="#forgot" className="text-xs font-medium text-[#4f46e5] hover:underline">
                  Quên mật khẩu?
                </a>
              </div>

              {/* Submit Button */}
              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="h-10 font-medium bg-[#4f46e5] hover:!bg-[#3525cd] border-none shadow-sm text-sm rounded-lg"
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>

            <div className="text-center mt-4 pt-2 border-t border-gray-100">
              <p className="text-xs text-[#464555]">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-semibold text-[#4f46e5] hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>

          </div>
        </section>
      </div>
    </ConfigProvider>
  );
};