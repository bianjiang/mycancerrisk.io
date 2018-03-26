from flask import Blueprint, request, jsonify, session
from pymongo import MongoClient
from bson.objectid import ObjectId
import json
import math
from flask import current_app
import numpy as np
from time import gmtime, strftime, strptime
from dbmongo import db
from datetime import datetime


crc_beta_ar = {}
crc_hazard = {}
crc_avgrisk = {}
race = ['white','black','hispanic','asian']

with open("./crcdata/crc_beta_ar.json") as json_file:
    crc_beta_ar = json.load(json_file)

with open("./crcdata/crc_hazard.json") as json_file:
    crc_hazard = json.load(json_file)

with open("./crcdata/crc_avgrisk.json") as json_file:
    crc_avgrisk = json.load(json_file)


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

riskcalculator = Blueprint('riskcalculator',__name__)

def ar_calculator(One_AR_RR,Race,gender,T1,T2):
    One_ARxRR_r = One_AR_RR[0]
    One_ARxRR_p = One_AR_RR[1]
    One_ARxRR_d = One_AR_RR[2]

    Strt_j      = T1 - 49;
    End_j       = T2 - 50;

    AbsRsk_5        = 0
    AbsRsk_10        = 0
    AbsRsk_life      = 0
    AbsRsk           = 0
    S_j_1       = 1

    jth         = Strt_j

    while jth <= End_j:
        index = math.floor((jth-1)/5)
        Rect_H1 = crc_hazard[gender]["Rect_H1"][race[Race-1]][index]
        Prxm_H1 = crc_hazard[gender]["Prxm_H1"][race[Race-1]][index]
        Dist_H1 = crc_hazard[gender]["Dist_H1"][race[Race-1]][index]
        H2 = crc_hazard[gender]["H2"][race[Race-1]][index]
        SumHaz = One_ARxRR_r * Rect_H1 + One_ARxRR_p * Prxm_H1 + One_ARxRR_d * Dist_H1
        Surv_This = math.exp(- SumHaz - H2)
        AbsRsk    = AbsRsk + (SumHaz/(SumHaz+H2))*(1-Surv_This)*S_j_1
        S_j_1     = S_j_1*Surv_This
        jth       = jth + 1

    return AbsRsk

def CI_calculator(Var_Pi,AbsRsk):
    #variance and 95 CI of ln odds @
    lnOdds      = math.log(AbsRsk/(1-AbsRsk))
    Var_lnOdds  = Var_Pi * (1/math.pow(AbsRsk*(1-AbsRsk),2))
    SE_lnOdds   = math.sqrt(Var_lnOdds)
    CILlnOdds   = lnOdds - 1.96*SE_lnOdds
    CIUlnOdds   = lnOdds + 1.96*SE_lnOdds

    CIL         = math.exp(CILlnOdds)/(1+math.exp(CILlnOdds))
    CIU         = math.exp(CIUlnOdds)/(1+math.exp(CIUlnOdds))


    return [CIL,CIU]

# get start time
@riskcalculator.route('/starttest',methods=['POST'])
def starttest():
    try:
        if request.json['info'] == 'start':
            db.logging.insert_one({
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'user_id': session['id'],
                'event_type': 'start_test'
                })
            return jsonify(message={'info': 'success'})
        else:
            return jsonify(message={'info': 'failed'})
    except Exception as e:
        return str(e)


@riskcalculator.route('/saveuserinfo',methods=['POST'])
def updateForm():
    try:
        usr_test = {}
        json_data = request.json['info']
        usr_test['test_data'] = json_data

        # the jaon_data is 'dict'
        ### declear input variable ###
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        BMI_male = -1
        BMI_female = -1
        Veg = -1
        posi = [0,0,0,0]
        No_NSaids = -1
        hrs_Xrcise = 0
        interval = 0
        Rel_CRC = 0
        Rel_Trend = 0
        AbsRisk = [0,0,0]
        CI = [0,0,0]
        ModerXrcis = 0
        VigrXrcis = [0,0,0] #women
        No_Strogn = 0 #women
        BMI30YesStrgn = 0 #women
        No_IBupro = -1 #man
        Cigarets = 0 #man
        CigYr = [0,0,0,0] #man
        ### translate the form data into input ###
        if json_data['demographics']['hispanic'] == 3:
            Race = 3
        else:
            Race = json_data['demographics']['race']

        T1 = json_data['demographics']['age']

        height = json_data['demographics']['height_feet']*12 + json_data['demographics']['height_inches']
        weight = json_data['demographics']['weight']
        BMI = (weight/(height*height))*703

        if json_data['diet']['vegetables_serving'] <= 4:
            Veg = 1
        else:
            Veg = 0

        if json_data['medical_history']['colon_sigmo'] == -1:
            posi[json_data['medical_history']['polyp']] = 1
        else:
            posi[json_data['medical_history']['colon_sigmo']] = 1

        No_IBupro = json_data['medications']['NoIBuprofen']

        if No_IBupro == 0:
            No_NSaids = json_data['medications']['No_NSaids(IBuprofen)']
        else:
            No_NSaids = json_data['medications']['No_NSaids(NoIBuprofen)']

        if No_IBupro == -9:
            No_IBupro = 0
        if No_NSaids == -9:
            No_NSaids = 0

        if json_data['physical_activity']['vigorous_activity_months'] == 0:
            VigrXrcis[0] = 1
            if json_data['physical_activity']['moderate_activity_months'] == 0:
                hrs_Xrcise = 3
            else:
                tmp_hrs = json_data['physical_activity']['moderate_activity_hours']
                if tmp_hrs <= 2:
                    hrs_Xrcise = 2
                elif tmp_hrs <= 4:
                    hrs_Xrcise = 1
                else:
                    hrs_Xrcise = 0
        else:
            if json_data['physical_activity']['moderate_activity_months'] == 0:
                tmp_hrs = json_data['physical_activity']['vigorous_activity_hours']
                if tmp_hrs <= 2:
                    hrs_Xrcise = 2
                elif tmp_hrs <= 4:
                    hrs_Xrcise = 1
                else:
                    hrs_Xrcise = 0
            else:
                vig_temp = json_data['physical_activity']['vigorous_activity_hours']
                mod_temp = json_data['physical_activity']['moderate_activity_hours']
                if vig_temp <= 2:
                    VigrXrcis[1] = 1
                elif vig_temp <= 4:
                    VigrXrcis[2] = 1
                else:
                    pass
                tmp_hrs = vig_temp + mod_temp
                if tmp_hrs <= 2:
                    hrs_Xrcise = 2
                elif tmp_hrs <= 4:
                    hrs_Xrcise = 1
                else:
                    hrs_Xrcise = 0

        if json_data['family']['cancer_relatives'] == -1:
            if json_data['family']['num_cancer_relatives'] == 2:
                Rel_CRC = 1
                Rel_Trend = 2

            else: # -8 /
                Rel_CRC = 1
                Rel_Trend = 1
        else:
            Rel_CRC = 0
            Rel_Trend = 0
        gender = json_data['demographics']['gender']
        #Rel_Trend
         ### male input only ###
        if gender == 'Male':
            if BMI <= 24.9:
                BMI_male = 0
            elif BMI <=29.9:
                BMI_male = 1
            else:
                BMI_male = 2

            if json_data['male_miscellaneous']['somke'] != -1:
                CigYr[0] = 1
                Cigarets = 0
            else:
                if json_data['male_miscellaneous']['start_time'] == 0:
                    CigYr[0] = 1
                    Cigarets = 0
                else:
                    Cigarets = json_data['male_miscellaneous']['Num_Cigs']
                    if json_data['male_miscellaneous']['current_smoke'] == 'yes':
                        interval = T1 - json_data['male_miscellaneous']['start_time']
                    else:
                        interval = json_data['male_miscellaneous']['time_quit'] - json_data['male_miscellaneous']['start_time']
                    if interval >= 35:
                        CigYr[2] = 1
                    elif interval >= 15:
                        CigYr[1] = 1
                    elif interval > 0:
                        CigYr[3] = 1
                    else:
                        CigYr = [0,0,0,0]

            input_data = [Race,posi[0],posi[1],posi[2],No_IBupro,Rel_CRC,hrs_Xrcise,CigYr[0],CigYr[1],CigYr[2],Veg,Cigarets,BMI_male,posi[1],posi[2],posi[3],No_NSaids,Rel_Trend]
            Xstar_r = input_data[1:7]
            Xstar_p = input_data[7:18]
            Xstar_d = input_data[12:18]
            RR = [0,0,0]
            for i in range(6):
                RR[0] += Xstar_r[i] * crc_beta_ar['man_Rect_Beta'][i]
                RR[2] += Xstar_d[i] * crc_beta_ar['man_Dist_Beta'][i]
            for j in range(11):
                RR[1] += Xstar_p[j] * crc_beta_ar['man_Prxm_Beta'][j]
            for k in range(3):
                RR[k] = math.exp(RR[k])
            One_AR_RR = [0,0,0]
            for m in range(3):
                One_AR_RR[m] = RR[m] * crc_beta_ar['male_One_AR'][m]

            # AbsRisk
            T2 = T1 + 5
            AbsRisk[0] = ar_calculator(One_AR_RR,Race,gender,T1,T2)
            T2 = T1 + 10
            AbsRisk[1] = ar_calculator(One_AR_RR,Race,gender,T1,T2)
            T2 = 90
            AbsRisk[2] = ar_calculator(One_AR_RR,Race,gender,T1,T2)

        ### female input only ###
        if gender == 'Female':
            if BMI <= 30:
                BMI_female = 0
            else:
                BMI_female = 1

            if json_data['female_miscellaneous']['periods'] == -1:
                if json_data['female_miscellaneous']['last_period'] == -1:
                    No_Strogn = json_data['female_miscellaneous']['female_hormones']
                else:
                    No_Strogn = 0
            else:
                No_Strogn = 0

            BMI30YesStrgn = (BMI >= 30) * (1 - No_Strogn)


            input_data = [Race,posi[0],posi[1],posi[2],No_Strogn,Rel_CRC,No_NSaids,VigrXrcis[0],VigrXrcis[1],VigrXrcis[2],BMI_female,hrs_Xrcise,Veg,No_NSaids,posi[1],posi[2],posi[3],No_Strogn,Rel_Trend,BMI_female,BMI30YesStrgn]
            # input_data = [1,0,0,1,1,1,1,1,0,0,1,3,1,1,0,1,0,1,2,1,0]
            Xstar_r = input_data[1:11]
            Xstar_p = input_data[11:19]
            Xstar_d = input_data[13:21]
            RR = [0,0,0]
            for i in range(8):
                RR[1] += Xstar_p[i] * crc_beta_ar['feman_Prxm_Beta'][i]
                RR[2] += Xstar_d[i] * crc_beta_ar['feman_Dist_Beta'][i]
            for j in range(10):
                RR[0] += Xstar_r[j] * crc_beta_ar['feman_Rect_Beta'][j]
            for k in range(3):
                RR[k] = math.exp(RR[k])
            One_AR_RR = [0,0,0]
            if T1 < 65:
                for m in range(3):
                    One_AR_RR[m] = RR[m] * crc_beta_ar['femal_One_AR_l65'][m]
            else:
                for m in range(3):
                    One_AR_RR[m] = RR[m] * crc_beta_ar['femal_One_AR_g65'][m]

            # AbsRisk
            T2 = T1 + 5
            AbsRisk[0] = ar_calculator(One_AR_RR,Race,gender,T1,T2)
            T2 = T1 + 10
            AbsRisk[1] = ar_calculator(One_AR_RR,Race,gender,T1,T2)
            T2 = 90
            AbsRisk[2] = ar_calculator(One_AR_RR,Race,gender,T1,T2)


        Avgrisk = [float(crc_avgrisk[gender][str(T1)][race[Race-1]][0]),float(crc_avgrisk[gender][str(T1)][race[Race-1]][1]),float(crc_avgrisk[gender][str(T1)][race[Race-1]][2])]
        usr_test['test_result'] = {'absRsk': AbsRisk, 'avgrisk': Avgrisk}

        # insert test_result
        if db.testUser.find_one({'id' : session['id']}) != None:
            db.testUser.update({'id': session['id']},{'$set':{'test_info.' + current_time : usr_test}})
            db.logging.insert_one({
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'user_id': session['id'],
                'event_type': 'end_test'
                })
        else:
            current_app.logger.info('can not find')
            return jsonify(status='ERROR',message='update test result failed')

        return jsonify(status='SUCCESS',message=current_time)
    except Exception as e:
        return str(e)


