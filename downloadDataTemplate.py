from ftplib import FTP

#SRA (every db will be a little different)
#this should be a list of run_ids from the run table
sra_list = ["SRR3112968","ERR969410","ERR1714508","SRR1586413"]

ftp = FTP('ftp.sra.ebi.ac.uk')
ftp.login()
for ix, run in enumerate(sra_list):
    ftp.cwd('/')
    if len(run)>9:
        prefix = "vol1/fastq/"+run[0:6]+"/00"+run[-1]+"/"+run+"/"
    else:
        prefix = "vol1/fastq/"+run[0:6]+"/"+run+"/"
    ftp.cwd(prefix)
    filenames = ftp.nlst() #get filenames within the directory
    for filename in filenames:
        file = open(filename, 'wb')
        print "downloading %s" % filename
        ftp.retrbinary('RETR '+ filename, file.write)
        file.close()

ftp.quit()
