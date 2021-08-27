## 
日常生活中，我们经常需要用到多个git账号，比如公司一个账号，私人一个账号，有时候是提交公司的代码，有时候是提交自己的代码到自己的github上，如果配置不同的ssh-key对应多个环境呢？
### 
第一步： 查看本地是否有ssh
执行命令：
cd ~/.ssh
查看是否有rsa文件
比如
```
test                           id_rsa.liangshuang15            known_hosts
config                          id_rsa.liangshuang15.pub
```
看到了id_rsa.liangshuang15和id_rsa.liangshuang15.pub，其中id_rsa.liangshuang15是私钥，id_rsa.liangshuang15.pub是公钥
说明此时本地已经有了一组ssh-key
如果本地没有ssh-key，按照下面方法生成ssh

第二步： 生成ssh-key
执行命令：
ssh-keygen -t rsa -C "1029660441@qq.com" -f ~/.ssh/github-rsa

后面的github-rsa给自己命名，比如github-rsa就是我自己私人账号的ssh-key

执行完后再查看cd ~/.ssh 就会得到下面
```
test                           github-rsa                      id_rsa.liangshuang15            known_hosts
config                          github-rsa.pub                  id_rsa.liangshuang15.pub
```
此时看到了两组rsa文件

第三步：添加私钥
执行命令1：ssh-add ~/.ssh/id_rsa.liangshuang15
执行命令2：ssh-add ~/.ssh/github-rsa

第四步：创建一个config(有则打开，无则创建（touch ~/config)在ssh目录下创建

config 
```
Host xxxxx.com
User liangshuang15
IdentityFile ~/.ssh/id_rsa.liangshuang15

 Host github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/github-rsa:
```

第五步：测试是否连接成功

执行：ssh -T git@github.com
如果出现 hi success 则表示成功
如果出现 Hi liangshuangs! You've successfully authenticated, but GitHub does not provide shell access.

则执行：git remote -v
出现下列

```
origin  https://github.com/liangshuangs/vue-study.git (fetch)
origin  https://github.com/liangshuangs/vue-study.git (push)
```
则是远端还是以https的形式拉取代码，需要修改为ssh方式

执行：git config url."ssh://git@github.com/".insteadOf https://github.com/

然后再执行 git remote -v
```
origin  ssh://git@github.com/liangshuangs/vue-study.git (fetch)
origin  ssh://git@github.com/liangshuangs/vue-study.git (push)
```
大功告成




