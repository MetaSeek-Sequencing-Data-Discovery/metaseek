import re

def parseLatLon(lat_lon_string):

    pattern1 = re.compile(r'[N,S][-+]?\d*\.\d+ [W,E][-+]?\d*\.\d+|[N,S][-+]?\d+ [W,E][-+]?\d+')
    pattern2 = re.compile(r"[-+]?\d*\.\d+ [N,S] [-+]?\d*\.\d+ [W,E]|\d+ [N,S] \d+ [W,E]|\d+ [N,S] [-+]?\d*\.\d+ [W,E]|[-+]?\d*\.\d+ [N,S] \d+ [W,E]")
    pattern3 = re.compile(r'[-+]?\d*\.\d+ [-+]?\d*\.\d+|[-+]?\d*\.\d+ [-+]?\d+')
    pattern4 = re.compile(r'[-+]?\d*\.\d+, [-+]?\d*\.\d+')
    pattern5 = re.compile(r"[-+]?\d*\.\d+ DD [-+]?\d*\.\d+ DD|[-+]?\d+ DD [-+]?\d+ DD|[-+]?\d+ DD [-+]?\d*\.\d+ DD|[-+]?\d*\.\d+ DD [-+]?\d+ DD")
    pattern6 = re.compile(r"[-+]?\d*\.\d+ [N,S], [-+]?\d*\.\d+ [W,E]|\d+ [N,S], \d+ [W,E]|\d+ [N,S], [-+]?\d*\.\d+ [W,E]|[-+]?\d*\.\d+ [N,S], \d+ [W,E]")
    pattern7 = re.compile(r'[-+]?\d*\.\d+ - [-+]?\d*\.\d+')
    pattern8 = re.compile(r'\([N,S]\:[W,E]\) [-+]?\d*\.\d+\:[-+]?\d*\.\d+')
    pattern9 = re.compile(r'[-+]?\d+\'\d+ [N,S] [-+]?\d+\'\d+ [W,E]')
    pattern10 = re.compile(r"[-+]?\d*\.\d+ [E,W], [-+]?\d*\.\d+ [N,S]")
    pattern11 = re.compile(r'[-+]?\d+\xc2\xb0 \d*\.\d+\'[N,S,E,W]')

    match1 = re.findall(pattern1,   lat_lon_string)
    match2 = re.findall(pattern2,   lat_lon_string)
    match3 = re.findall(pattern3,   lat_lon_string)
    match4 = re.findall(pattern4,   lat_lon_string)
    match5 = re.findall(pattern5,   lat_lon_string)
    match6 = re.findall(pattern6,   lat_lon_string)
    match7 = re.findall(pattern7,   lat_lon_string)
    match8 = re.findall(pattern8,   lat_lon_string)
    match9 = re.findall(pattern9,   lat_lon_string)
    match10 = re.findall(pattern10, lat_lon_string)
    match11 = re.findall(pattern11, lat_lon_string)

    if len(match1)>0:
        print 'matched 1'
        split2 = match1[0].split(' ')
        lat = float(split2[0][1:])
        lon = float(split2[1][1:])
        if split2[0][0]=='S':
            lat = lat*-1
        if split2[1][0]=='W':
            lon = lon*-1
        return lat, lon

    elif len(match2)>0:
        print 'matched 2'
        split = [x.split(' ') for x in match2]
        lat = split[0][0]
        lon = split[0][2]
        if split[0][1]=='S':
            lat = float(lat)*-1
        lat = float(lat)
        if split[0][3]=='W':
            lon = float(lon)*-1
        lon = float(lon)
        return lat, lon

    elif len(match3)>0:
        print 'matched 3'
        split3 = match3[0].split(' ')
        lat = float(split3[0])
        lon = float(split3[1])
        if lat>1000000:
            lat = lat/100000.0 #e.g. -4510469 = -45.10469
        elif lat>100000:
            lat = lat/10000.0 #e.g. -479595 = 47.7027
        if lon>1000000:
            lon = lon/100000.0
        elif lon>100000:
            lon = lon/10000.0
        return lat, lon

    elif len(match4)>0:
        print 'matched 4'
        split4 = match4[0].split(', ')
        lat = float(split4[0])
        lon = float(split4[1])
        return lat, lon

    elif len(match5)>0:
        print 'matched 5'
        split = [x.split(' ') for x in match5]
        lat = float(split[0][0])
        lon = float(split[0][2])
        return lat, lon

    elif len(match6)>0:
        print 'matched 6'
        split = [x.split(', ') for x in match6]
        split_lat = split[0][0].split(' ')
        split_lon = split[0][1].split(' ')
        lat = float(split_lat[0])
        lon = float(split_lon[0])
        if split_lat[1]=='S':
            lat = float(lat)*-1
        if split_lon[1]=='W':
            lon = float(lon)*-1
        return lat, lon

    elif len(match7)>0:
        print 'matched 7'
        split = match7[0].split(' - ')
        lat = float(split[0])
        lon = float(split[1])
        if lat>1000:
            lat = lat/10000.0 #e.g. -479595 = 47.7027
        if lon>1000:
            lon = lon/10000.0
        return lat, lon

    elif len(match8)>0:
        print 'matched 8'
        hems = match8[0].split(' ')[0][1:-1]
        hems = hems.split(':')
        nums = match8[0].split(' ')[1].split(':')
        lat = float(nums[0])
        lon = float(nums[1])
        if hems[0]=='S':
            lat = lat*-1
        if hems[1]=='W':
            lon = lon*-1
        return lat, lon

    elif len(match9)>0:
        print 'matched 9'
        split = match9[0].split(' ')
        lat = split[0]
        lat = re.sub('\'', '', lat)
        lat = float(lat)/10000
        if split[1]=='S':
            lat = lat*-1
        lon = split[2]
        lon = re.sub('\'', '', lon)
        lon = float(lon)/10000
        if split[3]=='W':
            lon = lon*-1
        return lat, lon

    elif len(match10)>0:
        print 'matched 10'
        split = [x.split(', ') for x in match10]
        split_lat = split[0][0].split(' ')
        split_lon = split[0][1].split(' ')
        lat = float(split_lat[0])
        lon = float(split_lon[0])
        if split_lat[1]=='S':
            lat = float(lat)*-1
        if split_lon[1]=='W':
            lon = float(lon)*-1
        return lat, lon

    elif len(match11)>0:
        print 'matched 11'
        lat = match11[0]
        lat = re.sub('\xc2\xb0 ', '', lat)
        lat = re.sub('\.','',lat)
        lat = lat.split('\'')
        lat = float(lat[0])/10000
        if lat[1]=='S':
            lat = lat*-1
        lon = match12[1]
        lon = re.sub('\xc2\xb0 ', '', lon)
        lon = re.sub('\.','',lon)
        lon = lon.split('\'')
        lon = float(lon[0])/10000
        if lon[1]=='W':
            lon = lon*-1
        return lat, lon

    else:
        print 'matched none'
        return None, None

def parseLatitude(lat_string):
    lat_string = re.sub('DD','',lat_string)

    pattern = re.compile(r"S")
    match = re.findall(pattern, lat_string)
    if len(match) > 0:
        lat_string = re.sub('S','',lat_string)
        lat_string = re.sub('\s*','',lat_string)
        try:
            lat = float(lat_string)
            lat = lat * -1
        except:
            return None
    else:
        lat_string = re.sub('N','',lat_string)
        lat_string = re.sub('\s*','',lat_string)
        try:
            lat = float(lat_string)
        except:
            return None

    return lat

def parseLongitude(lon_string):
    lon_string = re.sub('DD','',lon_string)

    pattern = re.compile(r"W")
    match = re.findall(pattern, lon_string)
    if len(match) > 0:
        lon_string = re.sub('W','',lon_string)
        lon_string = re.sub('\s*','',lon_string)
        try:
            lon = float(lon_string)
            lon = lon * -1
        except:
            return None
    else:
        lon_string = re.sub('E','',lon_string)
        lon_string = re.sub('\s*','',lon_string)
        try:
            lon = float(lon_string)
        except:
            return None

    return lon
