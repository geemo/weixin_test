'use strict';

const Tags = require('../lib/wechat_user').Tags;
const UserInfo = require('../lib/wechat_user').UserInfo;

const tags = new Tags();
const userInfo = new UserInfo();

// tags
// 	.create('bbb')
// 	.then(data => console.dir(data), err => console.error(err));

// tags
// 	.get()
// 	.then(data => console.dir(data), err => console.error(err));
	

// tags
// 	.update(100, 'ccc')
// 	.then(data => console.dir(data), err => console.error(err));

// tags
// 	.remove(100)
// 	.then(data => console.dir(data), err => console.error(err));

// tags
// 	.getIdList('ordKJxNYSCnnZxc2BM7Iyf3mLhjs')
// 	.then(data => console.dir(data), err => console.error(err));

// tags
// 	.getTagFans(101)
// 	.then(data => console.dir(data), err => console.error(err));

// tags
// 	.mBatchTagging(['ordKJxNYSCnnZxc2BM7Iyf3mLhjs'], 101)
// 	.then(data => console.dir(data), err => console.error(err));

// tags
// 	.mBatchUntagging(['ordKJxNYSCnnZxc2BM7Iyf3mLhjs'], 101)
// 	.then(data => console.dir(data), err => console.error(err));

// tags
// 	.method('getTagFans', {tagid: 101})
// 	.then(data => console.dir(data), err => console.error(err));


// userInfo
// 	.get('ordKJxNYSCnnZxc2BM7Iyf3mLhjs')
// 	.then(data => console.dir(data), err => console.error(err));

// userInfo
// 	.updateRemark('ordKJxNYSCnnZxc2BM7Iyf3mLhjs', 'fxx')
// 	.then(data => console.dir(data), err => console.error(err));

// userInfo
// 	.batchGet(['ordKJxNYSCnnZxc2BM7Iyf3mLhjs'])
// 	.then(data => console.dir(data), err => console.error(err));

userInfo
	.getList()
	.then(data => console.dir(data), err => console.error(err));