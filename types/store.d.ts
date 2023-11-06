import { UserUpdateDto } from '/@/api/dtos';
import { MenuUpdateDto } from '/@/api/dtos';
import { ErrorTypeEnum } from '/@/libs/enums/exceptionEnum';

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface LoginCache {
  account: string;
  password: string;
}

export interface UserInfo extends UserUpdateDto  {
}

// 网站信息
export interface WebsiteInfo {
  siteName: string;
  version: string | number;
  bgImg: string;
  logoImg: string;
}

@IsString()
@IsOptional()
@ApiProperty({ name: 'siteName', default: 'OA管理系统', type: 'string', description: '网站名称' })
siteName: string;

@IsString()
@IsOptional()
@ApiProperty({ name: 'siteDesc', default: 'OA管理系统后台客户端', type: 'string', description: '网站描述' })
siteDesc: string;

@IsString()
@IsOptional()
@ApiProperty({ name: 'siteIcon', default: '', type: 'string', description: '网站icon图片' })
siteIcon: string;

@IsString()
@IsOptional()
@ApiProperty({ name: 'siteLogo', default: '', type: 'string', description: '网站logo图片' })
siteLogo: string;

@IsString()
@IsOptional()
@ApiProperty({ name: 'loginBg', default: '', type: 'string', description: '网站背景图' })
loginBg: string;

@IsString()
@IsOptional()
@ApiProperty({ name: 'version', default: '1.0', type: 'string', description: '版本' })
version: string;

@IsString()
@IsOptional()
@ApiProperty({ name: 'updateTime', example: '1678048617060', type: 'string', description: '更新时间' })
updateTime: string;



export interface MenuItem extends MenuUpdateDto {
  // id?: string | number;
  // menuId?: string | number;
  // title: string;
  // icon?: string;
  // href?: string;
  // perms?: string;
  // parentId?: string | number;
  // sorting?: number;
  parents?: Array<MenuItem>;
  children?: MenuItem[];
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
}
