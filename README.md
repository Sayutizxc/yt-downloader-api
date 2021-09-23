# Youtube Downloader API

```bash
> git clone https://github.com/Sayutizxc/yt-downloader-api

> cd yt-downloader-api

> npm i

> npm start

```

- Example (items in [] are optional - items in <> are required)
```http
  http://127.0.0.1:3000/yt<?url={video_url}>[&q={video_quality}]<&format=mp3/mp4>
  http://127.0.0.1:3000/yt?url=https://www.youtube.com/watch?v=8IK6eLTNV1k&q=720
```

- Response
```json
  {
  "status": 200,
  "result": {
    "title": "[MV] REOL - 宵々古今 / YoiYoi Kokon",
    "thumb": "https://i.ytimg.com/vi/8IK6eLTNV1k/0.jpg",
    "size": "42.2 MB",
    "download_url": "https://file171.iijj.nl/?file=M3R4SUNiN3JsOHJ6WWQ2a3NQS1Y5ZGlxVlZIOCtyZ0pycDRJNGo4UFN1QUpnOWhxOXNIbEFad0tDL1JLbGRyblNZc1IwR3VkS2ZiT0VWdk1rOHhqWUZIRXIvZDI4Z2JBK3JjdlVJSmFXUjMzbGRtMXdXTW11VW40Ym95TEU3RmFhRWhyb2xScmptUEI2dWpickFIdHNYam85V3VPZkhCUDRCME5lS2YyNk0xRjFIM09JZlRyM3R0STVpdUozWWhNMWZ5aXJRNy8ycjAzaDlkNlZVdDZUTWgwOHN6dzg4VGlreFlTdjQ5TGlCMlU1KysyVXRneUdhckRVQk0yT3pvWjRQM3FTQklUeW5oUHJqM3FvdjkzdlRSZE43Tjg4bWZwcXF1eE1Xbk9MSmV3WElmWk9mN28"
  }
}
```
