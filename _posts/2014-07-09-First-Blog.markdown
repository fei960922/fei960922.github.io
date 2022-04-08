---
layout: post
title:  "网站建立记"
date:   2014-07-09 08:52:49
categories: Blog_Start
---

Hello World!

总之，捣鼓了一整天，这个基于Jekyll的blog终于成立啦~虽然至今无法在网上很好的显示- -

于是应助教sama的要求留下博客建立的过程，为后人做贡献。。。

##网站的构成方式：

这方面分成两点，网站本地的建立和网站的发布，这里需要分别用到jekyll和github恩。

- **Jekyll** 开始的时候以为是一个软件然后下好了就可以post自己的blog了，后来发现好像不是这样，确实是有Jekyll这个基于Ruby的软件，但是其实并不是必须的，他的作用仅仅是本地生成网站以作调试。jekyll更像一门语言，用于更加方便的组建个人网站，比如现在我只需要在gedit里面简单的输入文字，然后通过jekyll它会自动把我的这篇文章包装上tag加上heading和footer，然后形成一个够格的html，在加上css就成为一个很不错的页面了，于是如果要改风格，直接修改的default和css；而写文章，直接开个gedit用通俗易懂的markdown就可以了。

- **github** 所以说上文提到，jekyll这个软件并不是必须的，因为github上自带了它的编译器，我们只需要用jekyll的语法自己写好框架push到github上，它会自动生成个人网站的。（但是我失败了，似乎是没有加载成功CSS）

##我的安装环境：

首先我是一位windows用户！！！而且是win8.1用户！虽然mac很高富帅，linux非常geek，但是我还是坚守着windows的阵地！

恩。。。但是助教sama说用linux可以有5分的bonus，于是我毅然的在windows装上了虚拟机跑ubuntu 14.04（好想过于的没有节操了 。。。）但是！因为电脑配置实在过于的渣，所以虚拟机实在是非常的卡卡卡卡卡卡卡。而且，我的虚拟机竟然装不上输入法根本不知道为什么啊啊啊，所以，写文章这种事情还是交给了win8.1恩。

###在windows下，我安装了：

- Markdown Pad 2 	

	用于写Markdown文件，有实时显示赶脚还不错~

- Sublime Text 3 
	
	这个编辑器真的超级不错的，特别的喜欢恩，就是不支持GBK还要下插件有点烦以外都特别不错~

- GitHub for Windows
	
	这是一个傻瓜式的git的GUI客户端，github开发的当然只能在github上用，不过也包含git shell可以各种同步其他git网站。感觉以前觉得git要命令行好烦，下了客户端一切就明朗了~（然后再去尝试命令行操作就觉得亲切很多恩）

- Chrome 35

	这个感觉没啥好说的，恩。。。

- Vmware Player 6

	免费的虚拟机客户端，功能很精简，但是够用了，用它装了好多好多的系统，曾经装过winXP啊win7啊win8 RTM啊，还有NOI LINUX，ubuntu装了三个版本，还有Android也装过……其他的全被我扔到硬盘里了，就保留了Ubuntu唔。。

###在Ubuntu下，我安装了：

- git

	管理代码的。`sudo apt-get install git`

- jekyll

	恩。`gem install jekyll`

- 其他种种懒得说了

##坑爹的jekyll安装过程：

这里要单列一章啊恩，被坑惨了，从装完虚拟机开始。

首先呢，助教sama说了，windows下装jekyll特别的烦！linux下一句话就可以了：

	gem install jekyll

你信么，反正我没信，输进terminal直接就说gem找不到了。似乎是完整版Linux会各种自带编程环境，然后现在的Ubuntu精简了不少很多要自己装，于是装ruby：

	sudo apt-get install ruby

然后再次的`gem install jekyll`发现没有反应。连报错都没有。茫然了好久。。。后来百度了竟然发现。。。原来是因为速度慢，等了半个小时他还没下完所以没有任何反应。。。于是我们这样：

	gem install jekyll -V 

（-V代表输出所有状态信息）总算隔个几秒钟他会出现几行字让我知道他在跑，但是，这样是在太慢了- -于是加个gem的源：

	gem source -a http://ruby.taobao.org

（所以说竟然taobao都有gem的源简直无法想象、、、）

于是快速的装了，等待的结果却是：

	Error：Failed to build gem native extension.

找了好久是因为：没装divkit/版本过高/过低

	sudo apt-get install ruby1.9.1-dev

最后，总算装完了！！！！起码没有Error报错了！
但是。。。还是不能用- -

最后要装一个node.js：

	sudo apt-get install node.js

到这里，才真正算装完了。

##总算可以开始用了！

那么，我们现在已经把所有的软件装好了！

于是我们先用jekyll创建基本框架（所以说你其实完全不需要软件，自己新建一模一样的文件就可以了）(Personal_Blog是网站的名称)

	jekyll new Personal_Blog

然后，在/Personal_Blog文件夹下会有一堆文件，你可以尝试开启服务看一下效果：
	
	jekyll server --watch

开启服务器后在浏览器中输入：

	localhost

好吧，这个可能不行，输入terminal里Server address这个地址：（比如我是）
	
	http://0.0.0.0:4000

然后，就有了！尝试把他传到git上！

