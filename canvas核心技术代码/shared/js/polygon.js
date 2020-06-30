function Points(x, y) {
   this.x = x
   this.y = y
 }

 function Polygon(center, sideCount = 3, radius = 0, startAngle = 0, filled = true, strokeStyle = 'black', fillStyle = 'black') {
   this.center = center || new Points(0, 0)
   this.side = sideCount
   this.radius = radius
   this.filled = filled
   this.startAngle = startAngle
   this.strokeStyle = strokeStyle
   this.fillStyle = fillStyle
 }
 Polygon.prototype.getPoints = function () {
   const points = []
   let startAngle = this.startAngle || 0
   let delta = 360 / this.side
   for (let i = 0; i < this.side; i++) {
     let angle = startAngle + delta * i
   //   console.log(angle)
     points.push(new Points(
       this.center.x + this.radius * Math.cos(Math.PI * angle / 180),
       this.center.y - this.radius * Math.sin(Math.PI * angle / 180)
     ))
   }
   return points
 }
 Polygon.prototype.createPath = function (context) {
   const points = this.getPoints()
   // console.log(points)
   context.beginPath()
   context.moveTo(points[0].x, points[0].y)
   for (let i = 1; i < points.length; i++) {
     context.lineTo(points[i].x, points[i].y)
   }
   context.closePath()
 }

 Polygon.prototype.stroke = function (context) {
   context.save()
   this.createPath(context)
   context.strokeStyle = this.strokeStyle
   context.stroke()
   context.restore()

 }
 Polygon.prototype.fill = function (context) {
   context.save()
   this.createPath(context)
   context.fillStyle = this.fillStyle
   context.fill()
   context.restore()
   console.log('context shadowoffset： ',context.shadowOffsetX, context.shadowOffsetY, context.shadowBlur, context.shadowColor)
 }
 Polygon.prototype.move = function (x, y) {
   this.center = new Points(x, y)
 }