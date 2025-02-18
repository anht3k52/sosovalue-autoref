# Bot giới thiệu tự động giá trị Soso

Bot này tự động hóa quá trình tạo tài khoản và sử dụng mã giới thiệu cho Web SosoValue.

## Đặc trưng

- Sử dụng Gmail IMAP
- Sử dụng proxy để tránh lệnh cấm IP.
- Ghi nhật ký các tài khoản đã tạo.
- Bỏ qua captcha miễn phí bằng cách sử dụng con rối đã được thử nghiệm trên windows, linux.

## Yêu cầu

- Node.js v18.20.6 LTS [Tải xuống](https://nodejs.org/dist/v18.20.6/node-v18.20.6-x64.msi).
- Tài khoản giá trị Soso [Soso](https://sosovalue.com/join/FPT400OC).
- 2Captcha Apikey [2Captcha](https://2captcha.com/).
- Tài khoản Gmail.
- Cách lấy Email mật khẩu [Tại đây](https://www.youtube.com/watch?v=_rAoQeKpEtM)

## Ghi chú trên linux

nếu bạn muốn sử dụng con rối trên linux bạn phải cài đặt

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && sudo apt --fix-broken install -y && sudo apt install -f ./google-chrome-stable_current_amd64.deb -y && sudo apt install xvfb -y
npm i xvfb
```

## Cài đặt

1. Sao chép kho lưu trữ:

   ```sh
   git clone https://github.com/anht3k52/sosovalue-autoref.git
   cd sosovalue-autoref
   ```

2. Cài đặt các phần phụ thuộc:

   ```sh
   npm install
   npm run build
   ```

3. Tạo tệp `proxy.txt` trong thư mục gốc và thêm proxy của bạn (mỗi dòng một proxy) (Tùy chọn).

   ```
Định dạng proxy
   http://user:pass@host:port
   http://user:pass@host:port
   http://user:pass@host:port
   ```

4. Copy `config.json.example` to `config.json`.

   ```
   "email": "your_email",
   "password": "your_password",
   "captcha2": "your_2captcha_apikey"
   ```
## Cách sử dụng

1. Chạy bot:

```sh
npm run start
```
2. Làm theo lời nhắc để nhập ví dụ về mã giới thiệu của bạn, sau đó nhập (có bao nhiêu lượt giới thiệu)

## Đầu ra

- Các tài khoản đã tạo sẽ được lưu trong `accounts.txt`.

## Ghi chú

- Đảm bảo sử dụng proxy hợp lệ để tránh bị cấm IP.

## Luôn kết nối

- Channel Telegram : [Telegram](https://t.me/samcvn)


## Tuyên bố từ chối trách nhiệm

Công cụ này chỉ dành cho mục đích giáo dục. Sử dụng nó có nguy cơ của riêng bạn.
