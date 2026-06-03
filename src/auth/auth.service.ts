import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, userDocument } from 'src/user/schema/user.schema';
import { RegisterDTO } from './dto/register.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PayloadInterface } from './interface/payload.interface';
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';
import { redis } from 'redis.config';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<userDocument>,
    private readonly jwtService: JwtService,
    private readonly mailservice: MailService,
  ) {}

  private passwordHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private ComparePassword(
    password: string,
    hashpassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashpassword);
  }

  private generateRefreshToken(payload: PayloadInterface): string {
    return this.jwtService.sign(payload, {
      secret: 'refresh-token',
      expiresIn: '7d',
    });
  }
  private generateAccessToken(payload: PayloadInterface): string {
    return this.jwtService.sign(payload, {
      secret: 'access-token',
      expiresIn: '15m',
    });
  }

  async register(registerdata: RegisterDTO) {
    try {
      const isExists = await this.userModel.findOne({
        email: registerdata.email,
      });
      if (isExists) {
        throw new ConflictException('user already exists, Please Login');
      }

      const hashpassword = await this.passwordHash(registerdata.password);
      const adminRole = 'admin' as RegisterDTO['role'];
      if (registerdata.role === adminRole) {
        throw new ConflictException("you can't register for a role of admin");
      }

      const newUser = await this.userModel.create({
        name: registerdata.name,
        email: registerdata.email,
        role: registerdata.role,
        password: hashpassword,
      });

      const emailVerificationToken = randomBytes(32).toString('hex');
      const verificationLink = `http://localhost:3000/auth/verify/${emailVerificationToken}`;

      await redis.set(
        `verify:${emailVerificationToken}`,
        newUser._id.toString(),
        'EX',
        900,
      );
      await this.mailservice.sendMail(
        newUser.email,
        'Verify Email',
        `
  <h1>Email Verification</h1>
  <a href="${verificationLink}">
    Verify Account
  </a>
  `,
      );
      return {
        message: `new ${registerdata.role} created successfully`,
        user: newUser,
      };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async verifyEmail(token: string) {
    const userid = await redis.get(`verify:${token}`);
    if (!userid) {
      throw new ConflictException('Invalid or expired token');
    }

    await this.userModel.findByIdAndUpdate(userid, {
      isEmailVerified: true,
    });

    await redis.del(`verify:${token}`);
    return {
      message: 'email verified successfully',
    };
  }

  async forgotPassword(email: string) {
    try {
      console.log('hello ronak');
      if (!email) {
        throw new ConflictException('Please provide email..');
      }

      const user = await this.userModel.findOne({ email: email });
      if (!user) {
        throw new ConflictException('User not exists..');
      }

      const forgotpasswordToken = randomBytes(32).toString('hex');
      const resetpasswordLink = `http://localhost:3000/auth/reset-password/${forgotpasswordToken}`;

      await redis.set(
        `forgot-password:${forgotpasswordToken}`,
        user._id.toString(),
        'EX',
        900,
      );

      await this.mailservice.sendMail(
        user.email,
        'Forgot-Password',
        `
  <h1>Reset Password</h1>
  <a href="${resetpasswordLink}">
    Reset your password
  </a>
  `,
      );

      return {
        message: 'reset-password link send successfully',
      };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async resetPassword(token: string, password: string) {
    if (!token) {
      throw new NotFoundException('Either resetToken or email not exists.');
    }

    const userid = await redis.get(`forgot-password:${token}`);
    if (!userid) {
      throw new UnauthorizedException('user not exists..');
    }

    const user = await this.userModel.findById(userid);
    if (!user) {
      throw new UnauthorizedException('user not exists..');
    }
    const hashpassword = await this.passwordHash(password);
    user.password = hashpassword;
    await user.save();

    return { message: 'password reset successfully' };
  }

  async login(logindata: LoginDTO) {
    const user = await this.userModel.findOne({ email: logindata.email });
    if (!user) {
      throw new NotFoundException('user not exists, Please register first');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Verify your email first');
    }

    const isMatch = await this.ComparePassword(
      logindata.password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Password is Invalid');
    }

    const payload = {
      email: user.email,
      role: user.role,
      sub: user._id.toString(),
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    await redis.set(
      `refresh:${user._id.toString()}`,
      refreshToken,
      'EX',
      7 * 24 * 60 * 60,
    );

    return {
      message: 'login successfully',
      user,
      token: {
        accessToken,
        refreshToken,
      },
    };
  }

  async getProfile(request) {
    const userdetails = request as {
      email: string;
      role: string;
      sub: string;
    };
    if (!userdetails) {
      throw new NotFoundException('In request userdetails is not found');
    }

    const user = await this.userModel.findOne({ email: userdetails.email });

    return user;
  }
}
