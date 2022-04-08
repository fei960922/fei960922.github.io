---
layout: post
title:  "Slurm超算使用指南"
date:   2021-10-01 15:00:00
categories: Tools
---

# 舒适远程科研指南

## 简介

适用于XSEDE超算，UCLA超算，百度超算等使用Slurm调度系统控制的超算平台。基本思路:

1.  与本地linux一样搭建环境
2.  使用conda搭建python环境
3.  编写sbatch配置文件，在配置文件中选择GPU类型，超时时间，数量等。同时使用bash语句写下需要运行的程序，运行时选择对应版本的python调用。
4.  使用`sbatch xxx.sh` 提交任务并等待。 

## conda环境搭建

```bash
# Install conda environment from yaml file
conda env create --file environment.yaml 
# activate conda environment while debugging 
conda activate $ENVIRONMENT_NAME
# list all available conda environments
conda env list 
# deactivate conda environment 
conda deactivate 
```

## 代码调试

1.  配置SSH key私钥，通过ssh无密码登陆系统，设置host，无感使用VS code
2.  使用github repo同步代码，使用VS code直接修改代码，调试代码。

## sbatch文件

样例文件：

```bash
#!/usr/bin/env bash
#SBATCH --job-name=coop
#SBATCH --partition=GPU-shared
#SBATCH --gpus=1
#SBATCH --time=48:00:00
#SBATCH --export=ALL
#SBATCH --output="output_%j.out"

cd /jet/home/yifeixu/ocean/???
/jet/home/yifeixu/miniconda3/envs/gpointnet_gpu/bin/python ~/ocean/???
```

-   选择shared的GPU分支，并使用1个GPU。
    -   如果要使用小于8个GPU，`partition=GPU-shared`；如果要使用8个完整的GPU，设置`partition=GPU` 
-   对于Xsede，超时时间最多设置48小时。建议超过48小时的程序设置checkpoint，建议调试的时候设置时间<30分钟
-   `--export=ALL`表示输出所有的文件。对于CV类项目，即保存输出的文件。默认选择all即可
-   `--output="output_%j.out"`表示屏幕输出的位置。提交任务后，无法通过正常的命令行查看输出，必须去看这个log file。
-   `cd ...` 为了保证一致性，必须每次开始进入对应文件夹。
-   `$CONDAPATH/python $PYTHONFILE` 对应conda环境名称。

## 提交任务命令

-   `sbatch xxx.sh` :提交任务，返回一个7-8位数字是`$JOBID`。log file默认名为这个`output_$JOBID.out`。可以记住这个id，如果要提前终止这个程序，需要这个id。
-   `squeue -u yifeixu`：查看用户`yifeixu`运行的所有程序，可以查看job id。
    -   状态`R`代表正在运行
    -   状态`PD`代表正在等待资源

-   `scancel $JOBID`：终止`$JOBID`任务。

