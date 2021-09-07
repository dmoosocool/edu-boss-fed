/**
 * 课程相关请求模块
 */

import request from '@/utils/request'
import type { AxiosPromise } from 'axios'
import type { IBossResponse, IBossResponsePage } from './base.dto'

export interface IRequestQueryCourses {
  currentPage: number
  pageSize: number
  courseName: string
  status: string
}

export interface ICourseChangeState {
  courseId?: number
  status?: number
}

export interface IActivityCourseDTO {
  id?: number
  courseId?: number
  beginTime: string
  endTime: string
  amount: number
  stock: number
}

export interface ITeacherDTO {
  id?: number
  courseId?: number
  teacherName: string
  teacherHeadPicUrl: string
  position: string
  description: string
}

export interface ISection {
  id?: string | number
  courseId: string | number
  sectionName: string
  description: string
  orderNum: number
  status: number
}

export interface ILesson {
  courseId: string | number
  sectionId: undefined | string | number
  sectionName: string
  theme: string
  duration: number
  isFree: boolean
  orderNum: number
  status: number
}

export interface ICourse {
  activityCourse: boolean
  activityCourseDTO?: null | IActivityCourseDTO
  activityTime?: null | string
  activitySales?: null | number
  autoOnlineTime: string
  brief: string
  brokerageRate?: null | number
  compareTime?: null | string
  courseDescription?: null | string
  courseDescriptionMarkDown: string
  courseImgUrl: string
  courseListImg: string
  courseName: string
  courseUrl?: null | string
  createTime?: string
  discounts: number
  discountsTag: string
  distributionCopyriter?: null | string
  distributionPosterImage?: null | string
  h5url?: null | string
  id?: number
  isBuy?: boolean
  isDel?: boolean
  isNew: boolean
  isNewDes: string
  isStatusLoading?: boolean
  joinDistribution?: null
  lastLearnLessonName?: null | string
  lastNoticeTime?: null | string
  lastOperatorId?: null | string
  lessonUpdateCount?: null | number
  previewFirstField: string
  previewSecondField: string
  price: number
  priceTag: string
  sales: number
  sectionDTOS?: null
  seoDescription?: null | string
  seoKeywords?: null | string
  seoTitle?: null | string
  shareDescription?: null | string
  shareImageTitle?: null | string
  shareTitle?: null | string
  sortNum: number
  status: number
  tag?: null | string
  teacherId?: null | number
  teacherDTO?: null | ITeacherDTO
  topNCourseLesson?: null | string
  totalCourseTime?: null | string
  totalDuration?: null | string
  updateTime?: string
}

export const getQueryCourses = (
  data: IRequestQueryCourses,
): AxiosPromise<IBossResponse<IBossResponsePage<ICourse>>> => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data,
  })
}

export const changeState = (
  params: ICourseChangeState,
): AxiosPromise<IBossResponse<undefined>> => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params,
  })
}

export const saveOrUpdateCourse = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data,
  })
}

export const uploadCourseImage = (
  data: any,
  onUploadProgress?: (progressEvent: ProgressEvent) => void,
) => {
  // 该接口要求的请求数据类型是：multipart/form-data
  // 所以需要提交 FormData 数据对象
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data,
    // HTML5 新增的上传响应事件：progress
    onUploadProgress,
  })
}

export const getCourseById = (
  courseId: string | number,
): AxiosPromise<IBossResponse<ICourse>> => {
  return request({
    method: 'GET',
    url: '/boss/course/getCourseById',
    params: {
      courseId,
    },
  })
}

export const getSectionAndLesson = (courseId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId,
    },
  })
}

export const saveOrUpdateSection = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data,
  })
}

export const getSectionById = (sectionId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getBySectionId',
    params: {
      sectionId,
    },
  })
}

export const saveOrUpdateLesson = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data,
  })
}
