import re

def parseLatLon(lat_lon_string):

    pattern2 = re.compile(r"[-+]?\d*\.\d+ [N,S] [-+]?\d*\.\d+ [W,E]|\d+ [N,S] \d+ [W,E]|\d+ [N,S] [-+]?\d*\.\d+ [W,E]|[-+]?\d*\.\d+ [N,S] \d+ [W,E]")
    pattern3 = re.compile(r'[-+]?\d*\.\d+ [-+]?\d*\.\d+|[-+]?\d*\.\d+ [-+]?\d+')
    pattern4 = re.compile(r'[-+]?\d*\.\d+, [-+]?\d*\.\d+')

    match2 = re.findall(pattern2,   lat_lon_string)
    match3 = re.findall(pattern3,   lat_lon_string)
    match4 = re.findall(pattern4,   lat_lon_string)

    if len(match2)>0:
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
        split4 = match4[0].split(', ')
        lat = float(split4[0])
        lon = float(split4[1])
        return lat, lon

    else:
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
