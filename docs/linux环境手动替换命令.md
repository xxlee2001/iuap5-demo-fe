# linux环境手动替换命令

## 参照

find ./ -name "*.js" |grep -v grep |grep -v static |grep -v assets |xargs -i sed -i 's/${pom.fe.mdf.ctx}/\/u8c-baseservice/g' {}

## 打印

find ./ -name "*.js" |grep -v grep |grep -v static |grep -v assets |xargs -i sed -i 's/${pom.fe.print.domain}/http:\/\/172.20.57.209/g' {}

## 附件

find ./ -name "*.js" |grep -v grep |grep -v static |grep -v assets |xargs -i sed -i 's/${pom.fe.attchment.domain}/http:\/\/172.20.57.209/g' {}

## 审批

find ./ -name "*.html" |grep -v grep |grep -v static |grep -v assets |xargs -i sed -i  's/${pom.fe.ys.domain}/http:\/\/172.20.57.209/g' {}

## 一主多子上下文

find ./ -name "*.js" |grep -v grep |grep -v static |grep -v assets |xargs -i sed -i 's/${pom.fe.new.ctx}/\/demo-server/g' {}
