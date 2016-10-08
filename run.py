import os
import tornado.ioloop
import tornado.web


class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./bin/index.html")

def run():
  return tornado.web.Application([
    (r"/js/(.*)", tornado.web.StaticFileHandler, {"path": "./bin/js"}),
    (r"/assets/(.*)", tornado.web.StaticFileHandler, {"path": "./bin/assets"}),
    (r"/", MainHandler),
  ], debug=True)

if __name__ == "__main__":
  app = run()
  app.listen(3000)

  tornado.autoreload.start()
  for dir, _, files in os.walk('bin'):
    [tornado.autoreload.watch(dir + '/' + f) for f in files if not f.startswith('.')]

  tornado.ioloop.IOLoop.current().start()
