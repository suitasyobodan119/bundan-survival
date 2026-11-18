#!/usr/bin/env python3
"""分団サバイバル：src/ から index.html を組み立てる。
使い方: python3 tools/build.py   （リポジトリのいちばん上で実行）
- src/head.html   … <head>（GA・OGP など）
- src/style.css   … 見た目
- src/body.html   … 画面の部品（HTML）
- src/js/*.js     … プログラム。ORDER.txt の順につなぐ（順番に意味があるので並べかえない）
- src/tail.html   … 最後の閉じタグ
"""
import os,sys,subprocess
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S=lambda *p:open(os.path.join(R,'src',*p),encoding='utf-8').read()
order=[l.strip() for l in S('js','ORDER.txt').splitlines() if l.strip()]
js=''.join(S('js',f) for f in order)
out=S('head.html')+'<style>'+S('style.css')+'</style>'+S('body.html')+'<script>'+js+'</script>'+S('tail.html')
open(os.path.join(R,'index.html'),'w',encoding='utf-8').write(out)
tmp=os.path.join(R,'tools','.check.js');open(tmp,'w',encoding='utf-8').write(js)
r=subprocess.run(['node','--check',tmp],capture_output=True,text=True);os.remove(tmp)
if r.returncode:print(r.stderr);sys.exit('構文エラーがあります')
print(f'index.html を作りました（{len(out)//1024}KB・プログラム{len(order)}ファイル）')
