'use strict'
let user            = require('../controllers/user');
let request         = require('supertest')(user);
let Sequelize       = require('sequelize');
let sinon           = require('sinon');
let should          = require('should');
let errors          = require('../utils/errors');

let config          = require('../config');
let dbcontext       = require('../context/db')(Sequelize, config);

let userRepository  = dbcontext.user;
let postRepository  = dbcontext.post;
let likeRepository  = dbcontext.like;

const userService = require('../services/user')(dbcontext.user,dbcontext.userRole,dbcontext.post,  errors);
const postService = require('../services/posts')(dbcontext.post,dbcontext.user,dbcontext.like, errors);
const authService = require('../services/auth')(dbcontext.user,dbcontext.role,dbcontext.userRole, errors);
const cacheService = require('../services/cache');

/*
let authService = require('../services/user')(userRepository);
*/

var sandbox;
beforeEach(function ()
{
    sandbox = sinon.sandbox.create();
});

afterEach(function ()
{
    sandbox.restore();
});

let resolve = {Success:true};
let search = 'test';
let und_search = {};
let user1 = {
    id: 1,
    email: 'test@mail.ru',
    password: 123456,
    firstname: 'Michael',
    lastname: 'Chernyavskiy',
    image: 'test',
    image_id: 'test'
};
let user2 = {
    id: 2,
    email: 'test1@mail.ru',
    password: 123456,
    firstname: 'Michael1',
    lastname: 'Chernyavskiy1',
    image: 'test1',
    image_id: 'test1'
};
let post1 = {
    id: 1,
    title: 'test-title1',
    description: 'test-description1',
    type: 'image',
    image: 'test_image1',
    image_id: 'test_image_id1',
    likes: 3,
    userId: user1.id
};
let post2 = {
    id: 2,
    title: 'test-title2',
    description: 'test-description2',
    type: 'image',
    image: 'test_image',
    image_id: 'test_image_id',
    likes: 3,
    userId: user2.id
};
let post3 = {
    id: 3,
    title: 'test-title2',
    description: 'test-description2',
    type: 'video',
    image: 'test_image',
    image_id: 'test_image_id',
    likes: 3,
    userId: user2.id
};
let post4 = {
    id: 4,
    title: 'test-title2',
    description: 'test-description2',
    type: 'audio',
    image: 'test_image',
    image_id: 'test_image_id',
    likes: 3,
    userId: user2.id
};

describe('- Post Service testing', ()=> {
    describe('Search Data: ', () => {
        it('Check data on empty', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post1,post2]));
            let promise = postService.searchPost();
            return promise.catch((err) => {
                err.status.should.be.equal(errors.emptyData.status);
            })
        });
        it('Return object Data', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post1,post2]));
            let promise = postService.searchPost(search);
            return promise.then((result) => {
                result.should.be.an.Object();
            })
        });
        it('Return Data on JSON format', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post1,post2]));
            let promise = postService.searchPost(search);
            return promise.then((result) => {
                result.should.be.an.json;
            })
        });
    });

    describe('Count user posts: ', () => {
        it('Check data on empty', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post1,post2]));
            let promise = postService.countPosts();
            return promise.catch((err) => {
                err.status.should.be.equal(errors.emptyData.status);
            })
        });
        it('Return object Data', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post1,post2]));
            let promise = postService.countPosts(search);
            return promise.then((result) => {
                result.should.be.an.Object();
            })
        });
        it('Return Data on JSON format', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post1,post2]));
            let promise = postService.searchPost(search);
            return promise.then((result) => {
                result.should.be.an.json;
            })
        });
    });

   /* describe('Like user post: ', () => {
        it.only('Return Data on JSON format', () => {
            sandbox.stub(likeRepository, 'findOne').returns(Promise.resolve(user1.id));
            let promise = postService.likePost(user1.id,post1.id);
            return promise.then((result) => {
            })
        });
    })*/

     describe('Update post: ', () => {
        it('Check data on empty', () => {
             sandbox.stub(postRepository, 'update').returns(Promise.resolve(post1));
             let promise = postService.updatePost();
             return promise.catch((err) => {
                 err.status.should.be.equal(errors.emptyData.status);
             })
         });
         it('Return object Data', () => {
             sandbox.stub(postRepository, 'update').returns(Promise.resolve(post2));
             let promise = postService.updatePost(user1.id,post1.id);
             return promise.then((result) => {
                 result.should.be.an.Object();
             })
         });
         it('Return Data on JSON format', () => {
             sandbox.stub(postRepository, 'update').returns(Promise.resolve(post2));
             let promise = postService.updatePost(user1.id,post1.id);
             return promise.then((result) => {
                 result.should.be.an.json;
             })
         });
     });

    describe('Get all user videos: ', () => {
        it('Check data on empty', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post3]));
            let promise = postService.getAllUserVideo();
            return promise.catch((err) => {
                err.status.should.be.equal(errors.emptyData.status);
            })
        });
        it('Return object Data', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post3]));
            let promise = postService.getAllUserVideo(user2.id,post3.id);
            return promise.then((result) => {
                result.should.be.an.Object();
            })
        });
        it('Return Data on JSON format', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post3]));
            let promise = postService.getAllUserVideo(user2.id,post3.id);
            return promise.then((result) => {
                result.should.be.an.json;
            })
        });
    });

    describe('Get all user audios: ', () => {
        it('Check data on empty', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post4]));
            let promise = postService.getAllUserAudio();
            return promise.catch((err) => {
                err.status.should.be.equal(errors.emptyData.status);
            })
        });
        it('Return object Data', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post4]));
            let promise = postService.getAllUserAudio(user2.id,post4.id);
            return promise.then((result) => {
                result.should.be.an.Object();
            })
        });
        it('Return Data on JSON format', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post4]));
            let promise = postService.getAllUserAudio(user2.id,post4.id);
            return promise.then((result) => {
                result.should.be.an.json;
            })
        });
    });

    describe('Get all user images: ', () => {
        it('Check data on empty', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post1]));
            let promise = postService.getAllUserImages();
            return promise.catch((err) => {
                err.status.should.be.equal(errors.emptyData.status);
            })
        });
        it('Return object Data', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post1]));
            let promise = postService.getAllUserImages(user1.id,post1.id);
            return promise.then((result) => {
                result.should.be.an.Object();
            })
        });
        it('Return Data on JSON format', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post1]));
            let promise = postService.getAllUserImages(user1.id,post1.id);
            return promise.then((result) => {
                result.should.be.an.json;
            })
        });
    });

    describe('Get all images: ', () => {
        it('Return object Data', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post1,post2]));
            let promise = postService.getAllImages();
            return promise.then((result) => {
                result.should.be.an.Object();
            })
        });
        it('Return Data on JSON format', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post1]));
            let promise = postService.getAllImages();
            return promise.then((result) => {
                result.should.be.an.json;
            })
        });
    });

    describe('Get all videos: ', () => {
        it('Return object Data', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post3]));
            let promise = postService.getAllVideo();
            return promise.then((result) => {
                result.should.be.an.Object();
            })
        });
        it('Return Data on JSON format', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post3]));
            let promise = postService.getAllVideo();
            return promise.then((result) => {
                result.should.be.an.json;
            })
        });
    });

    describe('Get all audios: ', () => {
        it('Return object Data', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post3]));
            let promise = postService.getAllAudio();
            return promise.then((result) => {
                result.should.be.an.Object();
            })
        });
        it('Return Data on JSON format', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post3]));
            let promise = postService.getAllAudio();
            return promise.then((result) => {
                result.should.be.an.json;
            })
        });
    });

    describe('Delete post by id: ', () => {
        it('Check data on empty', () => {
            sandbox.stub(postRepository, 'destroy').returns(Promise.resolve(post1));
            let promise = postService.deleteById();
            return promise.catch((err) => {
                err.status.should.be.equal(errors.emptyData.status);
            })
        });
        it('Return object Data', () => {
            sandbox.stub(postRepository, 'destroy').returns(Promise.resolve(post1));
            let promise = postService.deleteById(1);
            return promise.then((result) => {
                result.should.be.an.Object();
            })
        });
        it('Return Data on JSON format', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve(post1));
            let promise = postService.deleteById(1);
            return promise.then((result) => {
                result.should.be.an.json;
            })
        });
    });

    describe('Get all posts: ', () => {
        it('Return object Data', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post3,post2,post1]));
            let promise = postService.getAll();
            return promise.then((result) => {
                result.should.be.an.Object();
            })
        });
        it('Return Data on JSON format', () => {
            sandbox.stub(postRepository, 'findAll').returns(Promise.resolve([post3,post2,post1]));
            let promise = postService.getAll();
            return promise.then((result) => {
                result.should.be.an.json;
            })
        });
    });

    describe('Get post by id: ', () => {
        it('Check data on empty', () => {
            sandbox.stub(postRepository, 'findById').returns(Promise.resolve(post1));
            let promise = postService.getById();
            return promise.catch((err) => {
                err.status.should.be.equal(errors.emptyData.status);
            })
        });
        it('Return object Data', () => {
            sandbox.stub(postRepository, 'findById').returns(Promise.resolve([post3,post2,post1]));
            let promise = postService.getById(post1.id);
            return promise.then((result) => {
                console.log(result);
                result.should.be.an.Object();
            })
        });
        it.only('Return Data on JSON format', () => {
            sandbox.stub(postRepository, 'findById').returns(Promise.resolve(post1));
            let promise = postService.getById(post1.id);
            return promise.then((result) => {
                result.should.be.an.json;
            })
        });
    });

});