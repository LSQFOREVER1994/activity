import request from '@/utils/request';
import serviceObj from '@/services/serviceObj';

const { courseService, bbsService, userService } = serviceObj;
//  获取课程标签
export async function getCourseTabs( obj ) {
  return request( `${courseService}/tags/courses`, {
    method: 'GET',
    body: obj,
  }, "JSON" );
}
//  获取投教课程列表
export async function getAllCourseList( obj ) {
  return request( `${courseService}/courses/all`, {
    method: 'GET',
    body: obj
  } );
}
//  获取投教课程列表
export async function getCourseList( obj ) {
  return request( `${courseService}/courses/page/detail`, {
    method: 'GET',
    body: obj
  } );
}

//  新增投教课程
export async function addCourse( obj ) {
  return request( `${courseService}/courses`, {
    method: 'POST',
    body: obj
  }, 'JSON' );
}

// 编辑投教课程
export async function updateCourse( obj ) {
  return request( `${courseService}/courses`, {
    method: 'PUT',
    body: obj
  }, 'JSON' );
}

//  删除投教课程
export async function delCourse( id ) {
  return request( `${courseService}/courses/${id}`, {
    method: 'DELETE',
    body: { id }
  } );
}

//  获取章节列表
export async function getChapterList( obj ) {
  return request( `${courseService}/chapters`, {
    method: 'GET',
    body: obj
  } );
}
//  新增章节
export async function addChapter( obj ) {
  return request( `${courseService}/chapters`, {
    method: 'POST',
    body: obj
  }, 'JSON' );
}

// 编辑章节
export async function updateChapter( obj ) {
  return request( `${courseService}/chapters`, {
    method: 'PUT',
    body: obj
  }, 'JSON' );
}

//  删除章节
export async function delChapter( id ) {
  return request( `${courseService}/chapters/${id}`, {
    method: 'DELETE',
    body: { id }
  } );
}

//  获取标签列表
export async function getTagsList( obj ) {
  return request( `${courseService}/tags/questions`, {
    method: 'GET',
    body: obj
  } );
}
//  获取标签列表
export async function getAllTagsList( obj ) {
  return request( `${courseService}/tags`, {
    method: 'GET',
    body: obj
  } );
}
//  新增标签
export async function addTags( obj ) {
  return request( `${courseService}/tags`, {
    method: 'POST',
    body: obj
  }, 'JSON' );
}

//  编辑标签
export async function updateTags( obj ) {
  return request( `${courseService}/tags`, {
    method: 'PUT',
    body: obj
  }, 'JSON' );
}

//  删除标签
export async function delTags( id ) {
  return request( `${courseService}/tags/${id}`, {
    method: 'DELETE',
    body: { id }
  } );
}

//  获取题目列表
export async function getSubjectList( obj ) {
  return request( `${courseService}/questions`, {
    method: 'GET',
    body: obj
  } );
}

//  新增题目
export async function addSubject( obj ) {
  return request( `${courseService}/questions`, {
    method: 'POST',
    body: obj
  }, 'JSON' );
}

//  编辑题目
export async function updateSubject( obj ) {
  return request( `${courseService}/questions`, {
    method: 'PUT',
    body: obj
  }, 'JSON' );
}

// 导入题目
export async function importSubject( obj ) {
  return request( `${courseService}/questions/batch`, {
    method: 'POST',
    body: obj
  }, 'JSON' );
}

//  删除题目
export async function delSubject( id ) {
  return request( `${courseService}/questions/${id}`, {
    method: 'DELETE',
    body: { id }
  } );
}

//  批量删除题目
export async function delBatchSubject( ids ) {
  return request( `${courseService}/questions/batch`, {
    method: 'DELETE',
    body: ids
  }, 'JSON' );
}

//  获取题目详情
export async function getSubjectDetail( id ) {
  return request( `${courseService}/questions/${id}`, {
    method: 'GET',
    // body: { id }
  } );
}

//  获取试卷列表
export async function getTestPaperList( obj ) {
  return request( `${courseService}/questions/packages`, {
    method: 'GET',
    body: obj
  } );
}

//  新增试卷
export async function addTestPaper( obj ) {
  return request( `${courseService}/questions/package`, {
    method: 'POST',
    body: obj
  }, 'JSON' );
}

//  编辑试卷
export async function updateTestPaper( obj ) {
  return request( `${courseService}/questions/package`, {
    method: 'PUT',
    body: obj
  }, 'JSON' );
}

//  删除试卷/
export async function delTestPaper( id ) {
  return request( `${courseService}/questions/package/${id}`, {
    method: 'DELETE',
    body: { id }
  } );
}

//  获取试卷详情
export async function getTestPaperDetail( id ) {
  return request( `${courseService}/questions/package/detail/${id}`, {
    method: 'GET',
    body: { id }
  } );
}

//  获取所有题目
export async function getAllSubjects( obj ) {
  return request( `${courseService}/questions/search`, {
    method: 'GET',
    body: obj
  } );
}

//  获取板块列表
export async function getPlateList( obj ) {
  return request( `${bbsService}/plants`, {
    method: 'GET',
    body: obj
  } );
}

//  新增板块
export async function addPlate( obj ) {
  return request( `${bbsService}/plants`, {
    method: 'POST',
    body: obj
  }, 'JSON' );
}

//  编辑板块
export async function updatePlate( obj ) {
  return request( `${bbsService}/plants`, {
    method: 'PUT',
    body: obj
  }, 'JSON' );
}

//  删除板块
export async function delPlate( id ) {
  return request( `${bbsService}/plants/${id}`, {
    method: 'DELETE',
    body: { id }
  } );
}

//  获取板块详情
export async function getPlateDetail( id ) {
  return request( `${bbsService}/plants/${id}`, {
    method: 'GET',
    body: { id }
  } );
}

//  获取帖子列表
export async function getPostList( obj ) {
  return request( `${bbsService}/topics/plant/${obj.plantCode}`, {
    method: 'GET',
    body: obj
  } );
}
//  获取帖子详情
export async function getTopicDetail( obj ) {
  return request( `${bbsService}/topics/ids`, {
    method: 'GET',
    body: obj
  } );
}

//  获取回帖列表
export async function getReplyList( obj ) {
  return request( `${bbsService}/topics/root-topic/${obj.topicId}`, {
    method: 'GET',
    body: obj
  } );
}
//  搜索帖子
export async function getSearchTopicList( obj ) {
  return request( `${bbsService}/topics/search`, {
    method: 'GET',
    body: obj
  } );
}
//  新增帖子
export async function addPost( obj ) {
  return request( `${bbsService}/topics/cms/virtual`, {
    method: 'POST',
    body: obj
  }, 'JSON' );
}

//  新增回帖
export async function addReply( obj ) {
  return request( `${bbsService}/topics/virtual/replay`, {
    method: 'POST',
    body: obj
  }, 'JSON' );
}

//  编辑帖子
export async function updatePost( obj ) {
  return request( `${bbsService}/topics/replay`, {
    method: 'PUT',
    body: obj
  }, 'JSON' );
}

//  删除帖子
export async function delPost( id ) {
  return request( `${bbsService}/topics/${id}`, {
    method: 'DELETE',
    body: { id }
  } );
}

//  搜索用户
export async function getUserBySearch( obj ) {
  return request( `${userService}/users/search`, {
    method: 'GET',
    body: obj,
  }, "JSON" );
}
//  用户列表
export async function getAllUser( obj ) {
  return request( `${userService}/users`, {
    method: 'GET',
    body: obj,
  }, "JSON" );
}



