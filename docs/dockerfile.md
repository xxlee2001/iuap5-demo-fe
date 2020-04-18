FROM base/nginx:1.15-alpine

WORKDIR /tempdir
# 将代码拷贝到编译环境
ADD ./ /tempdir/

WORKDIR /usr/share/nginx/html

RUN cp -r /tempdir/. /usr/share/nginx/html

# 参照上下文替换
RUN find ./ -name "*.js" |grep -v grep |grep -v static |grep -v assets |xargs -i sed -i 's/${pom.fe.mdf.ctx}/\/u8c-baseservice/g' {}

# 打印替换
RUN find ./ -name "*.js" |grep -v grep |grep -v static |grep -v assets |xargs -i sed -i 's/${pom.fe.print.domain}/http:\/\/172.20.57.209/g' {}

# 附件替换
RUN find ./ -name "*.js" |grep -v grep |grep -v static |grep -v assets |xargs -i sed -i 's/${pom.fe.attchment.domain}/http:\/\/172.20.57.209/g' {}

# 流程替换
RUN find ./ -name "*.html" |grep -v grep |grep -v static |grep -v assets |xargs -i sed -i  's/${pom.fe.ys.domain}/http:\/\/172.20.57.209/g' {}

# 节点上下文替换
RUN find ./ -name "*.js" |grep -v grep |grep -v static |grep -v assets |xargs -i sed -i 's/${pom.fe.main.ctx}/\/demo-server/g' {}

RUN find ./ -name "*.js" |grep -v grep |grep -v static |grep -v assets |xargs -i sed -i 's/${pom.fe.new.ctx}/\/demo-server/g' {}





# 设置文件的权限
RUN chmod 777 -R /usr/share/nginx/html
# nginx的端口
EXPOSE 80
# nginx启动命令
CMD ["nginx -g 'daemon off;'"]